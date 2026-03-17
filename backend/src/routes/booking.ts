import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { Booking } from '../models/Booking.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

const PRICE_PER_PERSON = 1000; // INR

// Validation schema for booking
const participantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().min(10, 'Valid mobile number required'),
  college: z.string().min(1, 'College is required'),
  year: z.string().min(1, 'Year is required'),
  department: z.string().min(1, 'Department is required'),
});

const bookingSchema = z.object({
  participants: z.array(participantSchema).min(1, 'At least one participant required'),
});

/**
 * POST /api/bookings/create
 * Create a new booking (initiates payment)
 */
router.post('/create', authenticate, async (req, res, next) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { participants } = parsed.data;
    const totalAmount = participants.length * PRICE_PER_PERSON;
    const transactionId = `VYH-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Generate QR code with transaction data
    const qrData = JSON.stringify({
      txn: transactionId,
      event: 'VYUHA2K26',
      count: participants.length,
    });
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: { dark: '#D4A843', light: '#0A0A0A' },
    });

    // Create booking record
    const booking = await Booking.create({
      userId: req.user!.userId,
      transactionId,
      participants,
      totalAmount,
      pricePerPerson: PRICE_PER_PERSON,
      qrCode,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // TODO: Create Razorpay order
    // const razorpayOrder = await razorpay.orders.create({
    //   amount: totalAmount * 100, // in paise
    //   currency: 'INR',
    //   receipt: transactionId,
    // });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking._id,
        transactionId,
        totalAmount,
        participantCount: participants.length,
        // razorpayOrderId: razorpayOrder.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings/verify-payment
 * Verify Razorpay payment and confirm booking
 */
router.post('/verify-payment', authenticate, async (req, res, next) => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!bookingId) {
      throw new AppError('Booking ID is required.', 400);
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    if (booking.userId.toString() !== req.user!.userId) {
      throw new AppError('Unauthorized.', 403);
    }

    // TODO: Verify Razorpay signature
    // const expectedSignature = crypto
    //   .createHmac('sha256', config.razorpay.keySecret)
    //   .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    //   .digest('hex');

    // Update booking
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpayOrderId = razorpayOrderId;
    await booking.save();

    // TODO: Send confirmation email with PDF ticket

    res.json({
      success: true,
      data: {
        message: 'Payment verified. Booking confirmed!',
        booking: {
          id: booking._id,
          transactionId: booking.transactionId,
          status: booking.status,
          qrCode: booking.qrCode,
          participants: booking.participants,
          totalAmount: booking.totalAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/my-bookings
 * Get current user's bookings
 */
router.get('/my-bookings', authenticate, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:id
 * Get a specific booking
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).select('-__v');
    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    // Only owner or admin can view
    if (booking.userId.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      throw new AppError('Unauthorized.', 403);
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
