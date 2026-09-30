import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { CONFIG } from '../config.js';
import { isMongoConnected, mongoStatusMessage } from '../db.js';

export const authRouter = Router();

// DB connection & auth health check
authRouter.get('/status', (req: Request, res: Response) => {
  res.json({
    isDbConnected: isMongoConnected,
    message: mongoStatusMessage,
    setupGuide: !isMongoConnected
      ? 'MongoDB is currently not detected. To enable permanent accounts and match records, start a MongoDB instance (e.g. `mongod` or MongoDB Compass/Atlas) and configure MONGODB_URI in your .env file.'
      : 'MongoDB connected and ready.',
  });
});

// Signup
authRouter.post('/signup', async (req: Request, res: Response) => {
  if (!isMongoConnected) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'MongoDB is required for creating accounts. Please ensure MongoDB is running (' + mongoStatusMessage + ').',
    });
  }

  try {
    const { nickname, email, password } = req.body;

    if (!nickname || typeof nickname !== 'string' || nickname.trim().length < 2) {
      return res.status(400).json({ error: 'Nickname must be at least 2 characters.' });
    }
    if (nickname.trim().length > 20) {
      return res.status(400).json({ error: 'Nickname cannot exceed 20 characters.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      nickname: nickname.trim(),
      email: cleanEmail,
      passwordHash,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id.toString(), nickname: newUser.nickname, email: newUser.email },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        nickname: newUser.nickname,
        email: newUser.email,
        gamesPlayed: newUser.gamesPlayed,
        totalScore: newUser.totalScore,
        wins: newUser.wins,
      },
    });
  } catch (err: any) {
    console.error('[Auth] Signup error:', err);
    return res.status(500).json({ error: 'Registration failed due to an internal server error.' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  if (!isMongoConnected) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'MongoDB is required to authenticate. Please check MongoDB status (' + mongoStatusMessage + ').',
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), nickname: user.nickname, email: user.email },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        nickname: user.nickname,
        email: user.email,
        gamesPlayed: user.gamesPlayed,
        totalScore: user.totalScore,
        wins: user.wins,
      },
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ error: 'Login failed due to an internal server error.' });
  }
});

// Verify token / Current user
authRouter.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as { userId: string; nickname: string; email: string };
    
    if (isMongoConnected) {
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (user) {
        return res.json({
          user: {
            id: user._id.toString(),
            nickname: user.nickname,
            email: user.email,
            gamesPlayed: user.gamesPlayed,
            totalScore: user.totalScore,
            wins: user.wins,
          },
        });
      }
    }

    return res.json({
      user: {
        id: decoded.userId,
        nickname: decoded.nickname,
        email: decoded.email,
        gamesPlayed: 0,
        totalScore: 0,
        wins: 0,
      },
    });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
});
