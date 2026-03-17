import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Razorpay payment service.
 * Creates orders and verifies payment signatures.
 */

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(
  amount: number,
  receipt: string
): Promise<RazorpayOrder> {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    // Dev mode: return mock order
    return {
      id: `order_dev_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      receipt,
      status: 'created',
    };
  }

  const auth = Buffer.from(
    `${config.razorpay.keyId}:${config.razorpay.keySecret}`
  ).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt,
      notes: {
        event: 'Vyuha 2K26',
        date: '2026-03-30',
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Razorpay order creation failed: ${error}`);
  }

  return res.json() as Promise<RazorpayOrder>;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!config.razorpay.keySecret) {
    // Dev mode: skip verification
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetchPaymentDetails(paymentId: string): Promise<Record<string, unknown>> {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    return { id: paymentId, status: 'captured', method: 'dev' };
  }

  const auth = Buffer.from(
    `${config.razorpay.keyId}:${config.razorpay.keySecret}`
  ).toString('base64');

  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch payment details');
  }

  return res.json() as Promise<Record<string, unknown>>;
}
