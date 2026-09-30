import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import { connectDB } from './db.js';
import { authRouter } from './routes/auth.js';
import { matchesRouter } from './routes/matches.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/matches', matchesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Raja Rani Royal Game Server',
  });
});

// In production, serve the built Vite React frontend
const clientDistPath = path.resolve(__dirname, '../dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Raja Rani Server</title></head>
          <body style="font-family:sans-serif;background:#F5EBDD;color:#352820;padding:40px;text-align:center;">
            <h1>🤴 Raja Rani Game Server 👸</h1>
            <p>Backend is running on port ${CONFIG.PORT}. In development mode, run <code>npm run dev:client</code> to launch the Vite frontend.</p>
          </body>
        </html>
      `);
    }
  });
});

// Start DB connection and HTTP server
async function startServer() {
  void connectDB();

  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${CONFIG.PORT} is already in use. Close the other game terminal or change PORT in .env.` : error.message);
    process.exitCode = 1;
    process.exit(1);
  });

  server.listen(CONFIG.PORT, () => {
    console.log(`=========================================`);
    console.log(`🏰 Raja Rani Game Server is LIVE`);
    console.log(`📡 Port: ${CONFIG.PORT}`);
    console.log(`👑 Mode: ${CONFIG.NODE_ENV}`);
    console.log(`🔗 Local URL: http://localhost:${CONFIG.PORT}`);
    console.log(`=========================================`);
  });
}

startServer();
