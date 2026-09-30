import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/raja_rani',
  JWT_SECRET: process.env.JWT_SECRET || 'raja_rani_royal_secret_token_key_change_in_production',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
