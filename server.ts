import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import next from 'next';
import { CONFIG } from './src/lib/server/config';
import { connectDB } from './src/lib/server/db';
import { setupSocketHandlers } from './src/server/socket/socketHandler';

function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const projectRoot = process.cwd();
const isDev = CONFIG.NODE_ENV !== 'production';
const port = Number(CONFIG.PORT) || 5000;

// Initialize Next.js App
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
    console.log(`🏰 Preparing Raja Rani Next.js App (${isDev ? 'development' : 'production'})...`);
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

    // Setup Socket.IO on the same HTTP server
    const io = new Server(server, {
      path: '/socket.io',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    // Initialize authoritative socket event handlers
    setupSocketHandlers(io);

    // Public tunnel URL endpoint for 1-click sharing with friends anywhere
    app.get('/api/public-tunnel', (_req, res) => {
      try {
        const tunnelFilePath = path.join(projectRoot, '.tunnel_url');
        if (fs.existsSync(tunnelFilePath)) {
          const tunnelUrl = fs.readFileSync(tunnelFilePath, 'utf8').trim();
          if (tunnelUrl) {
            return res.json({ success: true, url: tunnelUrl });
          }
        }
      } catch {}
      return res.json({ success: false, url: null });
    });

    // Let Next.js handle all other requests including Route Handlers (like /api/health) and App Router pages
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    // Connect to MongoDB in background without blocking server startup
    void connectDB();

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${port} is already in use. Please close the other process or set PORT in .env.`);
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });

    server.listen(port, '0.0.0.0', () => {
      const localIps = getLocalIpAddresses();
      console.log(`=========================================`);
      console.log(`👑 Raja Rani Royal Game Server is LIVE`);
      console.log(`💻 Local (This PC):    http://localhost:${port}`);
      if (localIps.length > 0) {
        localIps.forEach((ip) => {
          console.log(`📱 Mobile/LAN URL:     http://${ip}:${port}`);
        });
      }
      console.log(`🏰 Mode: ${CONFIG.NODE_ENV}`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Failed to start Raja Rani game server:', err);
    process.exit(1);
  }
}

startServer();
