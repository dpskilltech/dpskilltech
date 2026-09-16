import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import {
  createStudentAccount,
  createCoachAccount,
  adminResetStudentPassword,
  adminResetCoachPassword,
  adminResendCredentials,
  getMfaStatus
} from '../controllers/adminAuth.controller';

const router = Router();

// Student provisioning & reset: Admin or Super Admin only
router.post('/students', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), createStudentAccount);
router.post('/students/reset-password', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), adminResetStudentPassword);

// Coach provisioning & reset: Admin or Super Admin only
router.post('/coaches', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), createCoachAccount);
router.post('/coaches/reset-password', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), adminResetCoachPassword);

// Resend credentials notification: Admin or Super Admin only
router.post('/resend-credentials', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), adminResendCredentials);

// MFA Management for Super Admin
router.get('/mfa/status', requireAuth, getMfaStatus);

export default router;
