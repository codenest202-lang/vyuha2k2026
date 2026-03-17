import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Event context for the AI chatbot
const EVENT_CONTEXT = `You are the official AI assistant for Vyuha 2K26, a college event happening on March 30, 2026.

Key facts:
- Event: Vyuha 2K26
- Date: March 30, 2026 (single day event)
- Registration: INR 1,000 per person
- 50+ events across Tech, Cultural, Business, and General categories
- Expected footfall: 5000+ attendees
- Key events: Code Clash (competitive programming), Dance Mania (solo/group dance), Startup Pitch (pitch to investors), Robo Wars (robot battle), Band Battle (live music), Quiz Quest (knowledge quiz)
- Schedule: 8 AM (registration) to 7 PM (DJ Night)
- 9:00 AM - Inaugural Ceremony
- 9:30 AM - Code Clash Round 1
- 10:00 AM - Dance Mania Solo
- 10:30 AM - Startup Pitch
- 11:00 AM - Robo Wars Qualifiers
- 12:00 PM - Lunch & Open Mic
- 1:00 PM - Code Clash Finals
- 1:30 PM - Dance Mania Group
- 2:30 PM - Robo Wars Finals
- 3:00 PM - Band Battle
- 4:00 PM - Quiz Quest
- 5:00 PM - Celebrity Guest Session
- 6:00 PM - Prize Distribution
- 7:00 PM - DJ Night & After Party

Payment: Via Razorpay (Cards, UPI, Netbanking)
Multi-person registration: One user can register multiple people

Be helpful, concise, enthusiastic and friendly about the event. If asked about registration, direct users to the Register page. If asked about something you don't know, say you'll check with the organizers. Never use blue-related language or references. The event theme is black and gold.`;

// Initialize Gemini AI (only if API key is configured)
let genAI: GoogleGenerativeAI | null = null;
let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

if (config.gemini.apiKey) {
  genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  console.log('[Chatbot] Gemini AI initialized successfully');
} else {
  console.log('[Chatbot] No Gemini API key configured, using placeholder responses');
}

/**
 * POST /api/chatbot/message
 * Send a message to the Gemini AI chatbot
 */
router.post('/message', async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      throw new AppError('Message is required.', 400);
    }

    let response: string;

    if (model) {
      // Use Gemini AI
      try {
        const prompt = `${EVENT_CONTEXT}\n\nUser question: ${message}\n\nRespond in a friendly, helpful way. Keep responses concise (2-3 sentences max unless more detail is needed).`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response;
        response = aiResponse.text();
      } catch (aiError) {
        console.error('[Chatbot] Gemini AI error:', aiError);
        // Fall back to placeholder
        response = getPlaceholderResponse(message);
      }
    } else {
      // Placeholder response when no API key
      response = getPlaceholderResponse(message);
    }

    res.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    next(error);
  }
});

function getPlaceholderResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('date') || lower.includes('when')) {
    return 'Vyuha 2K26 is happening on March 30, 2026. Mark your calendar!';
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('registration') || lower.includes('ticket')) {
    return 'Registration is INR 1,000 per person. You can register multiple people at once. Head to the Register page to sign up!';
  }
  if (lower.includes('event') || lower.includes('program') || lower.includes('what')) {
    return 'We have 50+ events across Tech (Code Clash, Robo Wars), Cultural (Dance Mania, Band Battle), Business (Startup Pitch), and General (Quiz Quest) categories. Check our Schedule page for the full lineup!';
  }
  if (lower.includes('schedule') || lower.includes('time') || lower.includes('timing')) {
    return 'The event runs from 8 AM (registration) to 7 PM (DJ Night). Key highlights: Code Clash at 9:30 AM, Dance Mania at 10 AM, Celebrity Guest at 5 PM, and DJ Night at 7 PM!';
  }
  if (lower.includes('pay') || lower.includes('upi') || lower.includes('card')) {
    return 'We accept payments via Razorpay - you can pay using UPI, credit/debit cards, or netbanking. The payment is processed securely during registration.';
  }
  if (lower.includes('venue') || lower.includes('where') || lower.includes('location')) {
    return 'Vyuha 2K26 is held at our Main Campus. Different events are spread across multiple venues including the Auditorium, Labs, Seminar Hall, and Open Air Theatre.';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hey there! Welcome to Vyuha 2K26 -- the ultimate college event on March 30, 2026. How can I help you? Ask me about events, schedule, registration, or anything else!';
  }
  if (lower.includes('thank')) {
    return 'You are welcome! See you at Vyuha 2K26 on March 30. It is going to be legendary!';
  }

  return 'That sounds interesting! Vyuha 2K26 has 50+ events on March 30, 2026. Registration is INR 1,000 per person. Check out our Schedule and About pages for more details, or ask me a specific question!';
}

export default router;
