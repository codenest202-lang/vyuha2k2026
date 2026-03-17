import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { config } from '../config/env.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendOtpEmail } from '../services/email.js';

const router = Router();

/**
 * POST /api/auth/email/send-otp
 * Send a magic OTP to the user's email address
 */
router.post('/email/send-otp', async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      throw new AppError('Email is required.', 400);
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    // Ensure user exists
    const userName = name || 'User';
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $setOnInsert: { email: email.toLowerCase(), name: userName, role: 'user' } },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendOtpEmail(email.toLowerCase(), otp, userName);

    // Also log in dev mode
    if (!config.isProduction) {
      console.log(`[Auth] OTP for ${email}: ${otp}`);
    }

    res.json({
      success: true,
      data: { message: 'OTP sent to your email address.' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/email/verify-otp
 * Verify the OTP and return a JWT
 */
router.post('/email/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError('Email and OTP are required.', 400);
    }

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      throw new AppError('Invalid or expired OTP.', 401);
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Get user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Check if admin
    const isAdmin = config.admin.emails.includes(email.toLowerCase());
    if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/google
 * Authenticate with Google OAuth token
 */
router.post('/google', async (req, res, next) => {
  try {
    const { googleId, email, name } = req.body;

    if (!googleId || !email) {
      throw new AppError('Google authentication data is required.', 400);
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        name,
        googleId,
        role: config.admin.emails.includes(email.toLowerCase()) ? 'admin' : 'user',
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId).select('-__v');
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/auth/profile
 * Update user profile
 */
router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, college, year, department } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(college && { college }),
        ...(year && { year }),
        ...(department && { department }),
      },
      { new: true }
    ).select('-__v');

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
