import { Router, Request, Response } from 'express';
import { MatchHistory } from '../models/MatchHistory.js';
import { User } from '../models/User.js';
import { isMongoConnected } from '../db.js';

export const matchesRouter = Router();

// Get recent matches
matchesRouter.get('/recent', async (req: Request, res: Response) => {
  if (!isMongoConnected) {
    return res.json({ matches: [] });
  }

  try {
    const matches = await MatchHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    return res.json({ matches });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch match history.' });
  }
});

// Get leaderboard
matchesRouter.get('/leaderboard', async (req: Request, res: Response) => {
  if (!isMongoConnected) {
    return res.json({ leaders: [] });
  }

  try {
    const leaders = await User.find()
      .sort({ totalScore: -1 })
      .limit(10)
      .select('nickname totalScore gamesPlayed wins')
      .lean();
    return res.json({ leaders });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});
