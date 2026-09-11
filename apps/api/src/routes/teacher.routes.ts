import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { db } from '../db/database';

const router = Router();

// Enforce teacher or admin role access
router.use(authenticateToken);
router.use(requireRole(['TEACHER', 'ADMIN']));

router.get('/dashboard', (req: Request, res: Response): void => {
  const userId = req.user!.userId;
  const user = db.findUserById(userId);

  if (!user) {
    res.status(404).json({ success: false, error: 'Teacher not found' });
    return;
  }

  const userProfile = db.getAuthUserResponse(user);
  const students = db.getAllStudents();

  res.status(200).json({
    success: true,
    data: {
      profile: userProfile,
      activeCohorts: [
        {
          id: 'batch_py_2026_01',
          name: 'Full Stack Python + AI (Batch 01)',
          studentCount: 14,
          maxCapacity: 15, // Rule 15-student batch limit
          schedule: 'Mon - Sat | 07:00 PM IST',
          nextTopic: 'Async I/O & FastAPI Concurrency'
        },
        {
          id: 'batch_ds_2026_01',
          name: 'Data Science & Machine Learning (Batch 01)',
          studentCount: 12,
          maxCapacity: 15,
          schedule: 'Mon - Sat | 08:30 PM IST',
          nextTopic: 'PyTorch Neural Network Tuning'
        }
      ],
      pendingEvaluations: 5,
      mockInterviewRequests: [
        {
          id: 'mock_req_01',
          studentName: 'Aarav Sharma',
          track: 'Full Stack Python + AI',
          requestedSlot: 'Tomorrow, 05:00 PM IST',
          type: 'Technical & System Design'
        }
      ],
      enrolledStudents: students.map((s) => ({
        id: s.user.id,
        name: s.user.fullName,
        email: s.user.email,
        attendance: s.profile?.attendanceRate || 100,
        batch: s.profile?.batchName
      }))
    }
  });
});

export default router;
