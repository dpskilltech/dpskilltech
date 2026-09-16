import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { db } from '../db/database';

const router = Router();

// Enforce student role access (Rule 15 & 16)
router.use(authenticateToken);
router.use(requireRole(['STUDENT']));

router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await db.findUserById(userId);

    if (!user) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    const userProfile = await db.getAuthUserResponse(user);

    res.status(200).json({
      success: true,
      data: {
        profile: userProfile,
        nextLiveClass: {
          title: 'Async I/O & FastAPI Concurrency Patterns',
          instructor: 'Dr. Rajesh Verma',
          date: 'Today',
          time: '07:00 PM IST (1.5 Hours)',
          zoomJoinUrl: 'https://zoom.us/j/9876543210?pwd=dpskilltech_sample_secure',
          batchName: (userProfile as any).studentProfile?.batchName || 'Batch PY-2026-01',
          isLive: true
        },
        recentRecordings: [
          {
            id: 'rec_01',
            title: 'Python Metaclasses & Custom Decorators',
            duration: '1h 32m',
            date: 'Yesterday',
            videoUrl: '#'
          },
          {
            id: 'rec_02',
            title: 'PostgreSQL Advanced Indexing & Query Plans',
            duration: '1h 28m',
            date: '2 days ago',
            videoUrl: '#'
          }
        ],
        pendingAssignments: [
          {
            id: 'asg_01',
            title: 'Build a Sandboxed Rate-Limiter with Redis & Python',
            dueDate: 'Tomorrow, 11:59 PM',
            status: 'PENDING'
          }
        ]
      }
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
