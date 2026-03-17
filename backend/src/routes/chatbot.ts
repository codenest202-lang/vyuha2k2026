import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Event context for the AI chatbot
const EVENT_CONTEXT = `
You are the official AI assistant for Vyuha 2K26, a college event happening on March 30, 2026.

Key facts:
- Event: Vyuha 2K26
- Date: March 30, 2026 (single day event)
- Registration: INR 1,000 per person
- 50+ events across Tech, Cultural, Business, and General categories
- Expected footfall: 5000+ attendees
- Key events: Code Clash, Dance Mania, Startup Pitch, Robo Wars, Band Battle, Quiz Quest
- Schedule: 8 AM (registration) to 7 PM (DJ Night)
- Celebrity guest session at 5 PM

Be helpful, concise, and enthusiastic about the event. If asked about registration,
direct users to the Register page. If asked about something you don't know,
say you'll check with the organizers.
`;

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

    // TODO: Integrate with Gemini AI API
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const result = await model.generateContent(`${EVENT_CONTEXT}\n\nUser: ${message}`);
    // const response = result.response.text();

    // Placeholder response for development
    const response = getPlaceholderResponse(message);

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
  if (lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('registration')) {
    return 'Registration is INR 1,000 per person. You can register multiple people at once. Head to the Register page to sign up!';
  }
  if (lower.includes('event') || lower.includes('program')) {
    return 'We have 50+ events across Tech (Code Clash, Robo Wars), Cultural (Dance Mania, Band Battle), Business (Startup Pitch), and General (Quiz Quest) categories. Check our Schedule page for the full lineup!';
  }
  if (lower.includes('schedule') || lower.includes('time')) {
    return 'The event runs from 8 AM (registration) to 7 PM (DJ Night). Key highlights: Code Clash at 9:30 AM, Dance Mania at 10 AM, Celebrity Guest at 5 PM, and DJ Night at 7 PM!';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hey there! Welcome to Vyuha 2K26. How can I help you? Ask me about events, schedule, registration, or anything else!';
  }

  return 'That sounds interesting! For detailed information, check out our About and Schedule pages. You can also register at the Register page. Anything else you would like to know about Vyuha 2K26?';
}

export default router;
