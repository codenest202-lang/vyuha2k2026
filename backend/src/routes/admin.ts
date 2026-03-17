import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/dashboard
 * Get dashboard analytics
 */
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [totalBookings, confirmedBookings, totalUsers, totalRevenue, recentBookings] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'confirmed' }),
        User.countDocuments(),
        Booking.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Booking.find({ status: 'confirmed' })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('userId', 'name email')
          .select('-qrCode -__v'),
      ]);

    const totalParticipants = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: { $size: '$participants' } } } },
    ]);

    const attendedCount = await Booking.countDocuments({
      status: 'confirmed',
      attendanceStatus: 'attended',
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          confirmedBookings,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalParticipants: totalParticipants[0]?.total || 0,
          attendedCount,
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/bookings
 * Get all bookings with pagination
 */
router.get('/bookings', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .select('-__v'),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/verify-qr
 * Verify a QR code and mark attendance
 */
router.post('/verify-qr', async (req, res, next) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      throw new AppError('Transaction ID is required.', 400);
    }

    const booking = await Booking.findOne({ transactionId })
      .populate('userId', 'name email');

    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    if (booking.status !== 'confirmed') {
      throw new AppError(`Booking is ${booking.status}. Cannot verify.`, 400);
    }

    if (booking.attendanceStatus === 'attended') {
      res.json({
        success: true,
        data: {
          message: 'Already checked in.',
          alreadyCheckedIn: true,
          booking: {
            transactionId: booking.transactionId,
            participants: booking.participants,
            checkedInAt: booking.checkedInAt,
          },
        },
      });
      return;
    }

    // Mark as attended
    booking.attendanceStatus = 'attended';
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user!.userId as any;
    await booking.save();

    res.json({
      success: true,
      data: {
        message: 'Check-in successful!',
        alreadyCheckedIn: false,
        booking: {
          transactionId: booking.transactionId,
          participants: booking.participants,
          checkedInAt: booking.checkedInAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/manual-verify
 * Manual verification by transaction ID or booking ID
 */
router.post('/manual-verify', async (req, res, next) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      throw new AppError('Identifier (transaction ID or booking ID) is required.', 400);
    }

    const booking = await Booking.findOne({
      $or: [{ transactionId: identifier }, { _id: identifier }],
    }).populate('userId', 'name email');

    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
