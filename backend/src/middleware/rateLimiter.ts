import { Request, Response, NextFunction } from 'express';

/**
 * Simple in-memory rate limiter.
 * In production, use Redis-backed rate limiting for distributed deployments.
 */
const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per window

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const entry = requests.get(ip);

  if (!entry || now > entry.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: { message: 'Too many requests. Please try again later.' },
    });
    return;
  }

  entry.count++;
  next();
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requests.entries()) {
    if (now > entry.resetTime) {
      requests.delete(ip);
    }
  }
}, WINDOW_MS);
