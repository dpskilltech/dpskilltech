import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { emailService } from '../services/email.service';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

const testEmailSchema = z.object({
  email: z.string().email('Please provide a valid recipient email address')
});

const sendWelcomeSchema = z.object({
  studentName: z.string().min(2),
  email: z.string().email(),
  courseName: z.string().min(2),
  batchName: z.string().min(2),
  schedule: z.string().min(2),
  zoomUrl: z.string().url()
});

const sendClassReminderSchema = z.object({
  studentName: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(2),
  instructor: z.string().min(2),
  date: z.string().min(2),
  time: z.string().min(2),
  zoomUrl: z.string().url(),
  batchName: z.string().min(2)
});

const sendMockBookingSchema = z.object({
  studentName: z.string().min(2),
  email: z.string().email(),
  track: z.string().min(2),
  scheduledAt: z.string().min(2),
  interviewerName: z.string().min(2),
  zoomUrl: z.string().url()
});

const sendMockScorecardSchema = z.object({
  studentName: z.string().min(2),
  email: z.string().email(),
  track: z.string().min(2),
  score: z.number().min(0).max(10),
  feedbackNotes: z.string().min(5),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([])
});

/**
 * Status of the email service
 */
router.get('/status', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: emailService.getStatus()
  });
});

/**
 * Send a test diagnostic email
 */
router.post('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = testEmailSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
      return;
    }

    const { email } = parseResult.data;
    const result = await emailService.sendTestEmail(email);

    res.status(200).json({
      success: result.success,
      message: `Diagnostic email dispatched to ${email}`,
      data: result
    });
  } catch (error: any) {
    console.error('Test email route error:', error);
    res.status(500).json({ success: false, error: 'Failed to send test email' });
  }
});

/**
 * Send Welcome Email upon Enrollment
 */
router.post('/send-welcome', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = sendWelcomeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
      return;
    }

    const result = await emailService.sendWelcomeEmail(parseResult.data);
    res.status(200).json({
      success: result.success,
      message: `Welcome email dispatched to ${parseResult.data.email}`,
      data: result
    });
  } catch (error: any) {
    console.error('Welcome email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send welcome email' });
  }
});

/**
 * Send Live Class Reminder
 */
router.post('/send-class-reminder', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = sendClassReminderSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
      return;
    }

    const result = await emailService.sendClassReminderEmail(parseResult.data);
    res.status(200).json({
      success: result.success,
      message: `Class reminder email sent to ${parseResult.data.email}`,
      data: result
    });
  } catch (error: any) {
    console.error('Class reminder email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send class reminder email' });
  }
});

/**
 * Send Mock Interview Booking Confirmation
 */
router.post('/send-mock-booking', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = sendMockBookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
      return;
    }

    const result = await emailService.sendMockInterviewBookingEmail(parseResult.data);
    res.status(200).json({
      success: result.success,
      message: `Mock interview confirmation sent to ${parseResult.data.email}`,
      data: result
    });
  } catch (error: any) {
    console.error('Mock interview booking email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send mock booking email' });
  }
});

/**
 * Send Mock Interview Scorecard (Instructor or Admin only)
 */
router.post(
  '/send-mock-scorecard',
  authenticateToken,
  requireRole(['TEACHER', 'ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = sendMockScorecardSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ success: false, error: parseResult.error.errors[0].message });
        return;
      }

      const result = await emailService.sendMockInterviewScorecardEmail(parseResult.data);
      res.status(200).json({
        success: result.success,
        message: `Evaluation scorecard sent to ${parseResult.data.email}`,
        data: result
      });
    } catch (error: any) {
      console.error('Scorecard email error:', error);
      res.status(500).json({ success: false, error: 'Failed to send scorecard email' });
    }
  }
);

export default router;
