import mongoose from 'mongoose';
import { CONFIG } from './config';

export let isMongoConnected = false;
export let mongoStatusMessage = 'Initializing MongoDB connection...';

export async function connectDB(): Promise<boolean> {
  if (!CONFIG.MONGODB_URI) {
    isMongoConnected = false;
    mongoStatusMessage = 'MONGODB_URI is not set. Running in in-memory guest mode.';
    console.warn(`[DB] ${mongoStatusMessage}`);
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(CONFIG.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    mongoStatusMessage = 'MongoDB connected successfully.';
    console.log('[DB] Connected to MongoDB.');
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    mongoStatusMessage = `MongoDB connection unavailable (${error?.message || 'offline'}). Guest gameplay active.`;
    console.warn(`[DB] Notice: ${mongoStatusMessage}`);
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  mongoStatusMessage = 'MongoDB disconnected.';
  console.warn('[DB] MongoDB connection lost. Guest gameplay active.');
});

mongoose.connection.on('reconnected', () => {
  isMongoConnected = true;
  mongoStatusMessage = 'MongoDB reconnected.';
  console.log('[DB] MongoDB connection restored.');
});
