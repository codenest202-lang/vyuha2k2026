import { config } from '../config/env.js';

/**
 * Telegram Bot API integration for image backup.
 * Sends images to a specified Telegram channel as off-site backup.
 */

export async function sendToTelegram(
  message: string,
  imageUrl?: string
): Promise<boolean> {
  if (!config.telegram.botToken || !config.telegram.channelId) {
    console.log('[Telegram] Bot not configured, skipping:', message);
    return false;
  }

  try {
    const baseUrl = `https://api.telegram.org/bot${config.telegram.botToken}`;

    if (imageUrl) {
      const res = await fetch(`${baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegram.channelId,
          photo: imageUrl,
          caption: message,
          parse_mode: 'HTML',
        }),
      });
      return res.ok;
    }

    const res = await fetch(`${baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegram.channelId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('[Telegram] Failed to send:', error);
    return false;
  }
}

export async function notifyNewBooking(
  transactionId: string,
  participantCount: number,
  totalAmount: number,
  userName: string
): Promise<void> {
  const message = [
    '<b>New Booking - Vyuha 2K26</b>',
    '',
    `<b>Transaction:</b> <code>${transactionId}</code>`,
    `<b>Booked by:</b> ${userName}`,
    `<b>Participants:</b> ${participantCount}`,
    `<b>Amount:</b> INR ${totalAmount.toLocaleString('en-IN')}`,
    '',
    `<i>${new Date().toLocaleString('en-IN')}</i>`,
  ].join('\n');

  await sendToTelegram(message);
}
