import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const serverUrl =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof window !== 'undefined' ? window.location.origin : '') ||
      '/';
    socket = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};
