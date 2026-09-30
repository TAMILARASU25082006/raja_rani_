import mongoose from 'mongoose';
import { CONFIG } from './config.js';

export let isMongoConnected = false;
export let mongoStatusMessage = 'Initializing MongoDB connection...';

export async function connectDB(): Promise<boolean> {
  if (!CONFIG.MONGODB_URI) {
    isMongoConnected = false;
    mongoStatusMessage = 'MONGODB_URI is not set. Please set MONGODB_URI in your environment or .env file.';
    console.warn(`[DB] ${mongoStatusMessage}`);
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(CONFIG.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    mongoStatusMessage = 'MongoDB connected successfully.';
    console.log('[DB] Connected to MongoDB.');
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    mongoStatusMessage = `MongoDB connection failed (${error.message}). Please start your MongoDB server or configure MONGODB_URI in .env.`;
    console.warn(`[DB] Warning: ${mongoStatusMessage}`);
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  mongoStatusMessage = 'MongoDB disconnected.';
  console.warn('[DB] MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  isMongoConnected = true;
  mongoStatusMessage = 'MongoDB reconnected.';
  console.log('[DB] MongoDB connection restored.');
});
