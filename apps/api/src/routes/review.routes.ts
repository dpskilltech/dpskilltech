import { Router, Request, Response, NextFunction } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/review.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Middleware that allows either standard JWT admin authentication OR dev admin key
const adminAuthGuard = (req: Request, res: Response, next: NextFunction): void => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === (process.env.ADMIN_SECRET_KEY || 'dpskilltech_admin_secret_2026')) {
    return next();
  }

  // Fall back to JWT token check
  authenticateToken(req, res, () => {
    requireRole(['ADMIN'])(req, res, next);
  });
};

/**
 * @route GET /api/reviews
 * @desc Get all verified student reviews (Public)
 */
router.get('/', getReviews);

/**
 * @route POST /api/reviews
 * @desc Submit an authentic student review (Public)
 */
router.post('/', createReview);

/**
 * @route DELETE /api/reviews/:id
 * @desc Delete a review (Admin Only - Rule 15)
 */
router.delete('/:id', adminAuthGuard, deleteReview);

export default router;
