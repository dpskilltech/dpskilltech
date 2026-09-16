import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import studentAuthRoutes from './routes/student-auth.routes';
import teacherRoutes from './routes/teacher.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import emailRoutes from './routes/email.routes';
import reviewRoutes from './routes/review.routes';
import adminAuthRoutes from './routes/adminAuth.routes';
import admissionsRoutes from './routes/admissions.routes';
import lessonsRoutes from './routes/lessons.routes';
import coursesRoutes from './routes/courses.routes';

import { checkDatabaseConnection } from './db/prisma';
import { emailService } from './services/email.service';
import { isSupabaseConfigured } from './lib/supabase';

// Load environment variables (Rule 9, 10, 11)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware configuration
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
  })
);

app.use(express.json());

// Request logger for diagnostic telemetry
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [API] ${req.method} ${req.originalUrl}`);
  next();
});

// Comprehensive Health check endpoint with Database, Supabase & Service verification
app.get('/api/health', async (_req: Request, res: Response) => {
  const dbStatus = await checkDatabaseConnection();
  const emailStatus = emailService.getStatus();

  res.status(200).json({
    status: 'ok',
    service: 'DP Skilltech API Service (Phase 1 Foundation)',
    environment: process.env.NODE_ENV || 'development',
    database: {
      provider: 'supabase-postgresql',
      singleSourceOfTruth: 'Supabase PostgreSQL (Prisma deprecated)',
      connected: dbStatus.isConnected,
      message: dbStatus.message
    },
    supabase: {
      configured: isSupabaseConfigured(),
      auth: 'Supabase Auth (Sole Authority: Email + Phone, Admin Student Provisioning, Admin-Only Reset, MFA)',
      storageAbstraction: 'StorageService Active (Cloudflare R2 for docs, Cloudflare Stream for video)'
    },
    paymentGateway: {
      method: 'UPI Only (Direct Verification)',
      configured: true
    },
    emailNotification: {
      configured: emailStatus.isConfigured,
      provider: emailStatus.provider,
      from: emailStatus.defaultFrom
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/student', studentAuthRoutes);  // password-changed and student-specific auth flows
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', lessonsRoutes);
app.use('/api', coursesRoutes);


// Catch-all 404 handler for undefined API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API Route '${req.method} ${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  DP Skilltech Backend API Server Active  `);
    console.log(`  Port: ${PORT}                           `);
    console.log(`  CORS Origin: ${CORS_ORIGIN}             `);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

export default app;
