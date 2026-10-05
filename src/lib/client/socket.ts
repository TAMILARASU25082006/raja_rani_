import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!socketInstance) {
    // Relative path ensures it works whether hosted on localhost, LAN, tunnel, or production domain
    socketInstance = io({
      path: '/socket.io',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    });
  }

  return socketInstance;
}
