import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db/database';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dpskilltech_dev_super_secret_jwt_key_2026_secured';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = '7d';

// Strict validation schemas (Rule 12)
const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  courseId: z.string().optional()
});

/**
 * Handles user login for Students, Teachers, and Admins
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { email, password } = parseResult.data;
    const user = db.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. No account found with this email.'
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'Your account has been deactivated. Please contact academic support.'
      });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Password does not match.'
      });
      return;
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(200).json({
      success: true,
      token,
      user: db.getAuthUserResponse(user)
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing authentication.'
    });
  }
};

/**
 * Handles student registration with initial enrollment and profile setup
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { fullName, email, password, phone, courseId } = parseResult.data;

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      });
      return;
    }

    const { user } = db.createStudent({
      fullName,
      email,
      passwordPlain: password,
      phone,
      courseId
    });

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(201).json({
      success: true,
      token,
      user: db.getAuthUserResponse(user)
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred during registration.'
    });
  }
};

/**
 * Returns current authenticated user and role-specific profile
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = db.findUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User record not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: db.getAuthUserResponse(user)
    });
  } catch (error: any) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while retrieving user profile.'
    });
  }
};

/**
 * Handles user logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};
