import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import next from 'next';
import { CONFIG } from './config.js';
import { connectDB } from './db.js';
import { authRouter } from './routes/auth.js';
import { matchesRouter } from './routes/matches.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const isDev = CONFIG.NODE_ENV !== 'production';
const port = Number(CONFIG.PORT) || 5000;

// Initialize Next.js app
const nextFn: any = (next as any).default || next;
const nextApp = nextFn({
  dev: isDev,
  hostname: '0.0.0.0',
  port,
  dir: projectRoot,
});
const handle = nextApp.getRequestHandler();

async function startServer() {
  try {
    // Prepare Next.js (compiles in dev, loads build cache in prod)
    console.log(`⏳ Initializing Next.js in ${isDev ? 'development' : 'production'} mode...`);
    await nextApp.prepare();

    const app = express();
    const server = http.createServer(app);

    // Enable CORS
    app.use(
      cors({
        origin: '*',
        credentials: true,
      })
    );

    app.use(express.json());

    // Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    // Initialize Socket handlers and GameManager
    setupSocketHandlers(io);

    // Express API Routes
    app.use('/api/auth', authRouter);
    app.use('/api/matches', matchesRouter);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Raja Rani Royal Game Server (Next.js App Router)',
      });
    });

    // Next.js handles all page routes, static assets, and client bundles
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    // Connect DB
    void connectDB();

    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error(
        error.code === 'EADDRINUSE'
          ? `Port ${port} is already in use. Close the other game terminal or change PORT in .env.`
          : error.message
      );
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`=========================================`);
      console.log(`🏰 Raja Rani Game Server is LIVE (Next.js)`);
      console.log(`📡 Port: ${port}`);
      console.log(`👑 Mode: ${CONFIG.NODE_ENV}`);
      console.log(`🔗 Local URL: http://localhost:${port}`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Failed to start Next.js game server:', err);
    process.exit(1);
  }
}

startServer();
