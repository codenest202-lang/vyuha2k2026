import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('[DB] Connected to MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected. Attempting reconnection...');
    });
  } catch (error) {
    console.error('[DB] Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}
