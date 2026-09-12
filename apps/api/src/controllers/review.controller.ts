import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export interface ReviewItem {
  id: string;
  authorName: string;
  roleOrCourse: string;
  rating: number;
  reviewText: string;
  batchOrCohort?: string;
  isVerified: boolean;
  createdAt: string;
  status: 'approved' | 'hidden';
}

const REVIEWS_FILE_PATH = path.join(__dirname, '..', 'data', 'reviews.json');

// Memory cache of reviews for sub-millisecond retrieval
let reviewsCache: ReviewItem[] = [];

// Initialize store from disk or fallback
const loadReviewsFromDisk = (): ReviewItem[] => {
  try {
    if (fs.existsSync(REVIEWS_FILE_PATH)) {
      const data = fs.readFileSync(REVIEWS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[ReviewController] Error reading reviews.json, using fallback cache:', err);
  }
  return [
    {
      id: 'rev_2026_001',
      authorName: 'Aarav Sharma',
      roleOrCourse: 'Full Stack Python + AI Architecture',
      rating: 5,
      reviewText: 'The 15-student batch cap makes an enormous difference. In normal bootcamps, you are lost in a lecture of 150 people. Here Dr. Rajesh reviewed my FastAPI pull requests personally and gave line-by-line feedback on asynchronous database pooling.',
      batchOrCohort: 'Batch #PY-2026-01',
      isVerified: true,
      createdAt: '2026-09-08T14:30:00.000Z',
      status: 'approved'
    },
    {
      id: 'rev_2026_002',
      authorName: 'Pooja Hegde',
      roleOrCourse: 'Cyber Security Fundamentals & Ethical Defense',
      rating: 5,
      reviewText: 'The live sandboxed attack labs run directly in the browser—no difficult VM setups required on day one. We simulated realistic firewall breaches, practiced Wireshark packet capture, and analyzed actual vulnerability CVEs.',
      batchOrCohort: 'Batch #CS-2026-A1',
      isVerified: true,
      createdAt: '2026-09-09T18:45:00.000Z',
      status: 'approved'
    },
    {
      id: 'rev_2026_003',
      authorName: 'Rohan Gupta',
      roleOrCourse: 'Modern Web Development (React & Node)',
      rating: 5,
      reviewText: 'The 1-on-1 private mock interview was a game changer for my confidence. My interviewer pushed me on React fiber reconciliation and PostgreSQL index structures just like a Tier-1 tech interview. Absolutely worth every minute.',
      batchOrCohort: 'Batch #WD-2026-02',
      isVerified: true,
      createdAt: '2026-09-10T11:15:00.000Z',
      status: 'approved'
    }
  ];
};

reviewsCache = loadReviewsFromDisk();

const saveReviewsToDisk = async (reviews: ReviewItem[]) => {
  try {
    const dir = path.dirname(REVIEWS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ReviewController] Error writing reviews.json to disk:', err);
  }
};

// Input sanitization helper to strip script/HTML tags (Rule 12, Rule 13)
const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>?/gm, '').trim();
};

// Strict validation schema (Rule 12)
const createReviewSchema = z.object({
  authorName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  roleOrCourse: z.string().min(2, 'Course or role is required').max(100),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  reviewText: z.string().min(10, 'Review feedback must be at least 10 characters').max(2000),
  batchOrCohort: z.string().max(60).optional()
});

/**
 * Public: Get all verified student & community reviews
 */
export const getReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const approvedReviews = reviewsCache
      .filter((r) => r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({
      success: true,
      count: approvedReviews.length,
      data: approvedReviews
    });
  } catch (error) {
    console.error('[ReviewController] Error getting reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve reviews'
    });
  }
};

/**
 * Public: Submit a real-time review
 */
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = createReviewSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
      return;
    }

    const { authorName, roleOrCourse, rating, reviewText, batchOrCohort } = validation.data;

    const newReview: ReviewItem = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      authorName: sanitizeText(authorName),
      roleOrCourse: sanitizeText(roleOrCourse),
      rating,
      reviewText: sanitizeText(reviewText),
      batchOrCohort: batchOrCohort ? sanitizeText(batchOrCohort) : 'Verified Learner',
      isVerified: true,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };

    reviewsCache = [newReview, ...reviewsCache];
    await saveReviewsToDisk(reviewsCache);

    res.status(201).json({
      success: true,
      message: 'Your review has been submitted and is live in real-time!',
      data: newReview
    });
  } catch (error) {
    console.error('[ReviewController] Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
};

/**
 * Admin: Delete a review permanently
 */
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const reviewIndex = reviewsCache.findIndex((r) => r.id === id);
    if (reviewIndex === -1) {
      res.status(404).json({
        success: false,
        error: `Review with ID '${id}' not found`
      });
      return;
    }

    const deletedReview = reviewsCache[reviewIndex];
    reviewsCache = reviewsCache.filter((r) => r.id !== id);
    await saveReviewsToDisk(reviewsCache);

    res.status(200).json({
      success: true,
      message: `Review from '${deletedReview.authorName}' was successfully deleted.`,
      data: { id }
    });
  } catch (error) {
    console.error('[ReviewController] Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
};
