import { Router } from 'express';
import { login, register, getMe, logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public auth endpoints
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Authenticated session check
router.get('/me', authenticateToken, getMe);

export default router;
