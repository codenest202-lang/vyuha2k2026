import { config } from '../config/env.js';

/**
 * Email service using SendGrid HTTP API.
 * Falls back to console logging in dev mode.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text } = options;

  if (!config.email.sendgridApiKey) {
    // Dev mode: log to console
    console.log(`[Email] To: ${to}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Body: ${text || html.substring(0, 200)}...`);
    return true;
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.email.sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: config.email.from, name: 'Vyuha 2K26' },
        subject,
        content: [
          { type: 'text/plain', value: text || subject },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('[Email] SendGrid error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

export async function sendOtpEmail(email: string, otp: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `Your Vyuha 2K26 Login Code: ${otp}`,
    text: `Hi ${name}, your OTP for Vyuha 2K26 is ${otp}. This code expires in 10 minutes.`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #D4A843, #B8860B); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: #0A0A0A;">Vyuha 2K26</h1>
          <p style="margin: 8px 0 0; color: #0A0A0A; opacity: 0.7; font-size: 14px;">March 30, 2026</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #A3A3A3; font-size: 14px; margin: 0 0 16px;">Hi ${name},</p>
          <p style="color: #A3A3A3; font-size: 14px; margin: 0 0 24px;">Use this code to log in to Vyuha 2K26:</p>
          <div style="background: rgba(212,168,67,0.1); border: 1px solid rgba(212,168,67,0.3); border-radius: 12px; padding: 24px; text-align: center;">
            <span style="font-family: monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #D4A843;">${otp}</span>
          </div>
          <p style="color: #525252; font-size: 12px; margin: 24px 0 0; text-align: center;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      </div>
    `,
  });
}

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  transactionId: string,
  totalAmount: number,
  participantCount: number,
  qrCode: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `Booking Confirmed - Vyuha 2K26 (${transactionId})`,
    text: `Hi ${name}, your booking for Vyuha 2K26 is confirmed! Transaction ID: ${transactionId}. Total: INR ${totalAmount}. ${participantCount} participant(s).`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #D4A843, #B8860B); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: #0A0A0A;">Vyuha 2K26</h1>
          <p style="margin: 8px 0 0; color: #0A0A0A; opacity: 0.7; font-size: 14px;">Booking Confirmed</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #A3A3A3; font-size: 14px; margin: 0 0 24px;">Hi ${name}, your booking is confirmed!</p>

          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #737373; font-size: 12px; padding: 4px 0;">Transaction ID</td>
                <td style="color: #D4A843; font-size: 14px; font-family: monospace; text-align: right; padding: 4px 0;">${transactionId}</td>
              </tr>
              <tr>
                <td style="color: #737373; font-size: 12px; padding: 4px 0;">Participants</td>
                <td style="color: #FFFFFF; font-size: 14px; text-align: right; padding: 4px 0;">${participantCount}</td>
              </tr>
              <tr>
                <td style="color: #737373; font-size: 12px; padding: 4px 0;">Total Amount</td>
                <td style="color: #FFFFFF; font-size: 14px; font-weight: bold; text-align: right; padding: 4px 0;">INR ${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #737373; font-size: 12px; padding: 4px 0;">Date</td>
                <td style="color: #FFFFFF; font-size: 14px; text-align: right; padding: 4px 0;">March 30, 2026</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <p style="color: #737373; font-size: 12px; margin: 0 0 12px;">Your Event QR Code:</p>
            <img src="${qrCode}" alt="QR Code" style="width: 200px; height: 200px; border-radius: 8px;" />
          </div>

          <p style="color: #525252; font-size: 11px; text-align: center; margin: 0;">
            Show this QR code at the event entrance for check-in. Do not share your ticket.
          </p>
        </div>
      </div>
    `,
  });
}
