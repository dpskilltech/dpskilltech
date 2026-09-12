import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { db } from '../db/database';

const router = Router();

// Enforce admin-only access
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await db.getAllUsers();
    const students = await db.getAllStudents();
    const teachers = await db.getAllTeachers();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents: students.length,
          totalTeachers: teachers.length,
          activeBatches: 3,
          averageBatchSize: 13.6,
          batchLimitCap: 15,
          mockInterviewsDelivered: 42
        },
        batches: [
          {
            id: 'batch_py_2026_01',
            name: 'Batch PY-2026-01',
            course: 'Full Stack Python + AI',
            enrolled: 14,
            limit: 15,
            status: 'ACTIVE',
            trainer: 'Dr. Rajesh Verma'
          },
          {
            id: 'batch_ds_2026_01',
            name: 'Batch DS-2026-01',
            course: 'Data Science & Machine Learning',
            enrolled: 12,
            limit: 15,
            status: 'ACTIVE',
            trainer: 'Ananya Deshmukh'
          },
          {
            id: 'batch_jv_2026_01',
            name: 'Batch JV-2026-01',
            course: 'Full Stack Java + AI',
            enrolled: 15,
            limit: 15,
            status: 'FULL (Capped)',
            trainer: 'Vikramaditya Rao'
          }
        ],
        recentUsers: users.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role,
          isActive: u.isActive,
          joinedDate: u.createdAt
        }))
      }
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
