import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// In-memory collections for offline development fallback
const memoryDemoBookings: any[] = [];
const memoryInquiries: any[] = [];

const demoBookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  parentName: z.string().optional(),
  phone: z.string().min(8, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional()
});

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required'),
  interestedCourseId: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

/**
 * Public: Submit Demo Booking (Course-Specific)
 */
router.post('/demo-booking', async (req: Request, res: Response): Promise<void> => {
  try {
    const parse = demoBookingSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: parse.error.errors[0].message });
      return;
    }

    // In production, Supabase is mandatory. Fail safely if not configured.
    if (process.env.NODE_ENV === 'production') {
      if (!supabaseAdmin) {
        res.status(500).json({
          success: false,
          error: 'Production Configuration Error: Supabase connection is required. In-memory storage is strictly disabled in production (Rule 25).'
        });
        return;
      }

      const { error } = await supabaseAdmin.from('demo_bookings').insert({
        course_id: parse.data.courseId,
        name: parse.data.name,
        parent_name: parse.data.parentName || null,
        phone: parse.data.phone,
        email: parse.data.email,
        preferred_date: parse.data.preferredDate || null,
        preferred_time: parse.data.preferredTime || null,
        message: parse.data.message || null,
        status: 'NEW'
      });

      if (error) {
        res.status(500).json({ success: false, error: `Failed to record demo reservation: ${error.message}` });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Your free demo class has been requested. Our admissions desk will confirm your slot within 24 hours.'
      });
      return;
    }

    // Development mode with offline resilience
    const bookingData = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...parse.data,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    memoryDemoBookings.push(bookingData);

    if (supabaseAdmin) {
      await supabaseAdmin.from('demo_bookings').insert({
        course_id: parse.data.courseId,
        name: parse.data.name,
        parent_name: parse.data.parentName || null,
        phone: parse.data.phone,
        email: parse.data.email,
        preferred_date: parse.data.preferredDate || null,
        preferred_time: parse.data.preferredTime || null,
        message: parse.data.message || null,
        status: 'NEW'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your free demo class has been requested. Our admissions desk will confirm your slot within 24 hours.',
      bookingId: bookingData.id
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to record demo reservation.' });
  }
});

/**
 * Public: Submit General Inquiry
 */
router.post('/inquiry', async (req: Request, res: Response): Promise<void> => {
  try {
    const parse = inquirySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: parse.error.errors[0].message });
      return;
    }

    // In production, Supabase is mandatory. Fail safely if not configured.
    if (process.env.NODE_ENV === 'production') {
      if (!supabaseAdmin) {
        res.status(500).json({
          success: false,
          error: 'Production Configuration Error: Supabase connection is required. In-memory storage is strictly disabled in production (Rule 25).'
        });
        return;
      }

      const { error } = await supabaseAdmin.from('general_inquiries').insert({
        name: parse.data.name,
        phone: parse.data.phone || null,
        email: parse.data.email,
        interested_course_id: parse.data.interestedCourseId || null,
        subject: parse.data.subject || 'General Course Inquiry',
        message: parse.data.message,
        status: 'NEW'
      });

      if (error) {
        res.status(500).json({ success: false, error: `Failed to record inquiry: ${error.message}` });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully. An academic advisor will reach out to you shortly.'
      });
      return;
    }

    // Development mode with offline resilience
    const inquiryData = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...parse.data,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    memoryInquiries.push(inquiryData);

    if (supabaseAdmin) {
      await supabaseAdmin.from('general_inquiries').insert({
        name: parse.data.name,
        phone: parse.data.phone || null,
        email: parse.data.email,
        interested_course_id: parse.data.interestedCourseId || null,
        subject: parse.data.subject || 'General Course Inquiry',
        message: parse.data.message,
        status: 'NEW'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. An academic advisor will reach out to you shortly.',
      inquiryId: inquiryData.id
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to submit inquiry.' });
  }
});

/**
 * Admin: List Demo Bookings
 */
router.get('/demo-bookings', requireAuth, requireRole(['ADMIN']), async (_req: Request, res: Response): Promise<void> => {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from('demo_bookings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      res.status(200).json({ success: true, count: data.length, demoBookings: data });
      return;
    }
  }

  // In production, never return development memory records
  if (process.env.NODE_ENV === 'production') {
    res.status(200).json({ success: true, count: 0, demoBookings: [] });
    return;
  }

  res.status(200).json({ success: true, count: memoryDemoBookings.length, demoBookings: memoryDemoBookings });
});

/**
 * Admin: List Inquiries
 */
router.get('/inquiries', requireAuth, requireRole(['ADMIN']), async (_req: Request, res: Response): Promise<void> => {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from('general_inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      res.status(200).json({ success: true, count: data.length, inquiries: data });
      return;
    }
  }

  // In production, never return development memory records
  if (process.env.NODE_ENV === 'production') {
    res.status(200).json({ success: true, count: 0, inquiries: [] });
    return;
  }

  res.status(200).json({ success: true, count: memoryInquiries.length, inquiries: memoryInquiries });
});

export default router;
