import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken, requirePermission } from '../middlewares/auth.middleware';
import { supabaseAdmin } from '../lib/supabase';
import { auditService } from '../services/audit.service';

const router = Router();

// =============================================================================
// Validation Schemas
// =============================================================================
const submitUpiSchema = z.object({
  enrollmentId: z.string().uuid('Valid enrollment ID required'),
  amount: z.number().positive('Amount must be positive'),
  utrNumber: z.string().min(6, 'Valid UPI UTR / Reference number required'),
  screenshotRef: z.string().optional()
});

const verifyPaymentSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional()
});

// =============================================================================
// POST /api/payment/submit-upi
//
// Students submit a UPI payment proof (UTR number & optional receipt screenshot).
// Records payment with verification_status = 'PENDING'.
// =============================================================================
router.post('/submit-upi', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  const parseResult = submitUpiSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
    return;
  }

  const { enrollmentId, amount, utrNumber, screenshotRef } = parseResult.data;
  const user = req.user!;

  try {
    // 1. Resolve student profile
    const { data: studentProfile, error: spError } = await supabaseAdmin
      .from('student_profiles')
      .select('id')
      .eq('profile_id', user.userId)
      .single();

    if (spError || !studentProfile) {
      res.status(403).json({ success: false, error: 'Student profile not found.' });
      return;
    }

    // 2. Verify enrollment belongs to this student
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('id, course_id, status')
      .eq('id', enrollmentId)
      .eq('student_profile_id', studentProfile.id)
      .single();

    if (enrollError || !enrollment) {
      res.status(404).json({ success: false, error: 'Enrollment not found.' });
      return;
    }

    // 3. Prevent duplicate UTR submission
    const { data: existingUtr } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('utr_number', utrNumber.trim())
      .single();

    if (existingUtr) {
      res.status(409).json({
        success: false,
        error: 'This UPI transaction UTR number has already been submitted.'
      });
      return;
    }

    // 4. Generate unique payment reference code
    const paymentCode = `DPSK-UPI-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 5. Insert payment record into Supabase PostgreSQL
    const { data: payment, error: insertError } = await supabaseAdmin
      .from('payments')
      .insert({
        payment_code: paymentCode,
        student_profile_id: studentProfile.id,
        enrollment_id: enrollment.id,
        amount: Math.round(amount),
        payment_method: 'UPI',
        utr_number: utrNumber.trim(),
        screenshot_ref: screenshotRef || null,
        verification_status: 'PENDING'
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Payment] Insert error:', insertError);
      res.status(500).json({ success: false, error: 'Failed to record payment.' });
      return;
    }

    // 6. Update enrollment state to PAYMENT_SUBMITTED
    await supabaseAdmin
      .from('enrollments')
      .update({ status: 'PAYMENT_SUBMITTED' })
      .eq('id', enrollment.id);

    // 7. Audit log event
    await auditService.log({
      actorUserId: user.userId,
      action: 'PAYMENT_SUBMITTED',
      entityType: 'payments',
      entityId: payment.id,
      newValue: {
        paymentCode,
        utrNumber: utrNumber.trim(),
        amount: Math.round(amount),
        enrollmentId
      }
    });

    res.status(201).json({
      success: true,
      message: 'UPI payment submitted successfully. Academic admissions will verify your UTR within 2-4 hours.',
      data: {
        paymentId: payment.id,
        paymentCode: payment.payment_code,
        status: 'PENDING',
        amount: payment.amount,
        paymentDate: payment.payment_date
      }
    });
  } catch (error) {
    console.error('[Payment] Submit error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// =============================================================================
// PATCH /api/payment/:paymentId/verify
//
// Admin verifies or rejects a submitted UPI payment.
// Requires granular permission 'payment.verify'.
// =============================================================================
router.patch(
  '/:paymentId/verify',
  authenticateToken,
  requirePermission('payment.verify'),
  async (req: Request, res: Response): Promise<void> => {
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    const { paymentId } = req.params;
    const parseResult = verifyPaymentSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
      return;
    }

    const { status, rejectionReason } = parseResult.data;
    const user = req.user!;

    try {
      // 1. Fetch current payment record
      const { data: payment, error: pError } = await supabaseAdmin
        .from('payments')
        .select('id, payment_code, enrollment_id, verification_status, amount')
        .eq('id', paymentId)
        .single();

      if (pError || !payment) {
        res.status(404).json({ success: false, error: 'Payment record not found.' });
        return;
      }

      if (payment.verification_status !== 'PENDING') {
        res.status(400).json({
          success: false,
          error: `Payment is already finalized with status: ${payment.verification_status}.`
        });
        return;
      }

      // 2. Update payment status in Supabase
      const updatePayload = {
        verification_status: status,
        verified_by: user.userId,
        verified_at: new Date().toISOString(),
        rejection_reason: status === 'REJECTED' ? rejectionReason || 'Payment rejected by administrator.' : null
      };

      const { data: updatedPayment, error: uError } = await supabaseAdmin
        .from('payments')
        .update(updatePayload)
        .eq('id', paymentId)
        .select()
        .single();

      if (uError) {
        res.status(500).json({ success: false, error: 'Failed to update payment status.' });
        return;
      }

      // 3. If verified, transition enrollment to ENROLLED / ACTIVE
      if (status === 'VERIFIED') {
        await supabaseAdmin
          .from('enrollments')
          .update({ status: 'ENROLLED' })
          .eq('id', payment.enrollment_id);
      } else {
        await supabaseAdmin
          .from('enrollments')
          .update({ status: 'PAYMENT_PENDING' })
          .eq('id', payment.enrollment_id);
      }

      // 4. Audit log event
      await auditService.log({
        actorUserId: user.userId,
        action: status === 'VERIFIED' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
        entityType: 'payments',
        entityId: paymentId,
        previousValue: { verificationStatus: 'PENDING' },
        newValue: { verificationStatus: status, rejectionReason: updatePayload.rejection_reason }
      });

      res.json({
        success: true,
        message: `Payment ${payment.payment_code} has been successfully ${status.toLowerCase()}.`,
        data: updatedPayment
      });
    } catch (error) {
      console.error('[Payment] Verification error:', error);
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  }
);

// =============================================================================
// GET /api/payment/my-payments
//
// Returns the student's payment history under strict RLS isolation.
// =============================================================================
router.get('/my-payments', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  const user = req.user!;

  try {
    const { data: studentProfile } = await supabaseAdmin
      .from('student_profiles')
      .select('id')
      .eq('profile_id', user.userId)
      .single();

    if (!studentProfile) {
      res.status(403).json({ success: false, error: 'Student profile not found.' });
      return;
    }

    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('id, payment_code, amount, payment_method, utr_number, payment_date, verification_status, rejection_reason, created_at')
      .eq('student_profile_id', studentProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch payments.' });
      return;
    }

    res.json({ success: true, data: payments ?? [] });
  } catch (error) {
    console.error('[Payment] My-payments error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

export default router;
