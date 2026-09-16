import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { getSupabaseAdmin } from '../lib/supabase';

const router = Router();

// =============================================================================
// GET /api/student/profile-flags
//
// Returns lightweight profile flags for the authenticated user.
// Used by the frontend to read requires_password_change from the DB
// (the single source of truth) rather than from Supabase user_metadata.
//
// Security:
//   - Requires valid Supabase JWT.
//   - Only returns flags for the currently authenticated user.
// =============================================================================
router.get('/profile-flags', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('requires_password_change')
      .eq('id', req.user.userId)
      .single();

    if (error || !profile) {
      res.status(404).json({ success: false, error: 'Profile not found.' });
      return;
    }

    res.json({
      success: true,
      requiresPasswordChange: profile.requires_password_change ?? false
    });
  } catch (error) {
    console.error('[StudentAuth] Error fetching profile flags:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// =============================================================================
// PATCH /api/student/password-changed
//
// Called by the frontend AFTER Supabase Auth successfully updates the password.
// This endpoint clears requires_password_change = FALSE in the profiles table.
//
// Security:
//   - Requires valid Supabase JWT (authenticateToken).
//   - Only clears the flag for the currently authenticated user (req.user.userId).
//   - The update is performed via the service-role client (bypasses RLS).
//   - Students CANNOT clear this flag directly via Supabase JS SDK
//     (blocked by the profiles UPDATE RLS WITH CHECK).
// =============================================================================
router.patch('/password-changed', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  const userId = req.user.userId;

  // Verify password was actually changed in Supabase Auth before clearing flag.
  // We check via the Supabase Admin API to confirm the user exists.
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser?.user) {
      res.status(404).json({
        success: false,
        error: 'User not found in authentication system.'
      });
      return;
    }

    // Clear the password-change requirement in the profiles table
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        requires_password_change: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[StudentAuth] Failed to clear requires_password_change:', updateError);
      res.status(500).json({
        success: false,
        error: 'Failed to update password change status. Please contact support.'
      });
      return;
    }

    // Audit log written by the audit trigger on profiles table automatically.
    // No manual insert needed here.

    res.json({
      success: true,
      message: 'Password change confirmed. Academy dashboard access granted.'
    });

  } catch (error) {
    console.error('[StudentAuth] Unexpected error in password-changed endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.'
    });
  }
});

export default router;
