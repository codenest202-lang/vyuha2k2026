import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant {
  name: string;
  mobile: string;
  college: string;
  year: string;
  department: string;
}

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: string;
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  participants: IParticipant[];
  totalAmount: number;
  pricePerPerson: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  qrCode: string;
  attendanceStatus: 'not-arrived' | 'attended';
  checkedInAt?: Date;
  checkedInBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      default: 'VYUHA2K26',
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    participants: {
      type: [participantSchema],
      required: true,
      validate: {
        validator: (v: IParticipant[]) => v.length >= 1,
        message: 'At least one participant is required.',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerPerson: {
      type: Number,
      default: 1000, // INR 1,000 per person
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    qrCode: {
      type: String,
      required: true,
    },
    attendanceStatus: {
      type: String,
      enum: ['not-arrived', 'attended'],
      default: 'not-arrived',
    },
    checkedInAt: { type: Date },
    checkedInBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast lookups
bookingSchema.index({ userId: 1, eventId: 1 });
bookingSchema.index({ transactionId: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
