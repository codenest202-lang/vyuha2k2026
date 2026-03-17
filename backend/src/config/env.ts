import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vyuha2k26',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },

  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    from: process.env.EMAIL_FROM || 'vyuha2k26@college.edu',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    channelId: process.env.TELEGRAM_CHANNEL_ID || '',
  },

  admin: {
    emails: (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean),
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
} as const;
