import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { GameManager } from '../game/GameManager.js';
import { CONFIG } from '../config.js';
import { RoleDefinition } from '../game/roleDefinitions.js';

interface SocketUserData {
  userId: string;
  nickname: string;
  isGuest: boolean;
  roomCode?: string;
  lastMessageTime?: number;
}

export function setupSocketHandlers(io: Server): GameManager {
  const socketDataMap = new Map<string, SocketUserData>();

  // Broadcast function for room state
  const broadcastState = (roomCode: string) => {
    const room = gameManager.getRoom(roomCode);
    if (!room) return;
    const publicState = room.getPublicState();
    io.to(roomCode).emit('room_state_update', publicState);
    io.to(roomCode).emit('chat_messages_update', room.chatMessages);
  };

  // Private role sender
  const sendPrivateRole = (socketId: string, role: RoleDefinition) => {
    io.to(socketId).emit('private_role_assigned', {
      id: role.id,
      name: role.name,
      tamilName: role.tamilName,
      points: role.points,
      description: role.description,
      tamilDescription: role.tamilDescription,
      hasCrown: role.hasCrown,
      category: role.category,
    });
  };

  // Targeted effect sender
  const sendTargetedEffect = (socketId: string, effectType: 'gunshot' | 'grenade' | 'neutral') => {
    io.to(socketId).emit('targeted_effect_trigger', { effectType });
  };

  const gameManager = new GameManager({
    broadcastState,
    sendPrivateRole,
    sendTargetedEffect,
  });

  io.on('connection', (socket: Socket) => {
    // Helper to ensure socket has valid user identity, auto-generating or recovering if missing
    const ensureUserData = (authData?: { token?: string | null; guestId?: string | null; nickname?: string | null }): SocketUserData => {
      let userData = socketDataMap.get(socket.id);
      if (userData) return userData;

      const token = authData?.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as { userId?: string; id?: string; nickname: string };
          const uId = decoded.userId || decoded.id;
          if (uId) {
            userData = {
              userId: uId,
              nickname: (decoded.nickname && decoded.nickname.trim()) ? decoded.nickname.trim().slice(0, 20) : 'Courteous Knight',
              isGuest: false,
            };
            socketDataMap.set(socket.id, userData);
            socket.emit('auth_success', { userId: userData.userId, nickname: userData.nickname, isGuest: false });
            return userData;
          }
        } catch {
          // Token invalid or expired, gracefully fall through to guest authentication
        }
      }

      const clientGuestId = authData?.guestId;
      const nickname = authData?.nickname;
      const guestId = clientGuestId && clientGuestId.startsWith('guest_') && clientGuestId.length >= 10
        ? clientGuestId
        : 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);

      const guestNick = (nickname && nickname.trim()) ? nickname.trim().slice(0, 20) : 'Guest_' + guestId.slice(-4);

      userData = {
        userId: guestId,
        nickname: guestNick,
        isGuest: true,
      };

      socketDataMap.set(socket.id, userData);
      socket.emit('auth_success', { userId: guestId, nickname: guestNick, isGuest: true });
      return userData;
    };

    // Authenticate socket handshake or auth message
    socket.on('authenticate', (data: { token?: string | null; guestId?: string | null; nickname?: string | null }) => {
      ensureUserData(data);
    });

    // Create room
    socket.on('create_room', (data: { maxCapacity?: number; chatEnabled?: boolean; guestId?: string; nickname?: string; token?: string }) => {
      const userData = socketDataMap.get(socket.id) || ensureUserData(data);

      const capacity = data?.maxCapacity ? Math.max(5, Math.min(30, data.maxCapacity)) : 10;
      const chatEnabled = data?.chatEnabled !== false;

      const room = gameManager.createRoom(userData.userId, capacity, chatEnabled);
      const joinResult = room.addPlayer(userData.userId, socket.id, userData.nickname);

      if (joinResult.success) {
        userData.roomCode = room.code;
        socket.join(room.code);
        socket.emit('room_created', { roomCode: room.code });
        broadcastState(room.code);
      } else {
        socket.emit('action_error', { message: joinResult.message || 'Failed to initialize chair in room.' });
      }
    });

    // Join room
    socket.on('join_room', (data: { roomCode: string; guestId?: string; nickname?: string; token?: string }) => {
      const userData = socketDataMap.get(socket.id) || ensureUserData(data);

      const code = data?.roomCode ? data.roomCode.toUpperCase().trim() : '';
      const room = gameManager.getRoom(code);
      if (!room) {
        socket.emit('action_error', { message: `Room "${code}" does not exist. Check the code and try again.` });
        return;
      }

      const joinResult = room.addPlayer(userData.userId, socket.id, userData.nickname);
      if (!joinResult.success) {
        socket.emit('action_error', { message: joinResult.message });
        return;
      }

      userData.roomCode = room.code;
      socket.join(room.code);
      socket.emit('room_joined', { roomCode: room.code, seatIndex: joinResult.seatIndex });
      room.addSystemMessage(`${userData.nickname} entered the royal hall.`);
      broadcastState(room.code);
    });

    // Toggle Ready status
    socket.on('toggle_ready', () => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      const success = room.toggleReady(userData.userId);
      if (success) {
        broadcastState(room.code);
      }
    });

    // Start match (owner only)
    socket.on('start_match', () => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      const startResult = room.startMatch(userData.userId);
      if (!startResult.success) {
        socket.emit('action_error', { message: startResult.message });
      } else {
        broadcastState(room.code);
      }
    });

    // Submit Accusation (Police only)
    socket.on('submit_accusation', (data: { targetSeatIndex: number }) => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      const result = room.submitAccusation(userData.userId, data.targetSeatIndex);
      if (!result.success) {
        socket.emit('action_error', { message: result.message });
      }
    });

    // Rematch / Play again (owner only)
    socket.on('play_again', () => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      const result = room.resetForRematch(userData.userId);
      if (!result.success) {
        socket.emit('action_error', { message: result.message });
      }
    });

    // Room Chat message (rate-limited)
    socket.on('send_chat', (data: { text: string }) => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      // Rate limit: 1 message per 500ms
      const now = Date.now();
      if (userData.lastMessageTime && now - userData.lastMessageTime < 500) {
        socket.emit('action_error', { message: 'Please slow down your messages.' });
        return;
      }
      userData.lastMessageTime = now;

      const res = room.addChatMessage(userData.userId, data.text);
      if (res.success) {
        io.to(room.code).emit('chat_messages_update', room.chatMessages);
      } else if (res.message) {
        socket.emit('action_error', { message: res.message });
      }
    });

    // Leave room
    socket.on('leave_room', () => {
      const userData = socketDataMap.get(socket.id);
      if (userData && userData.roomCode) {
        const room = gameManager.getRoom(userData.roomCode);
        if (room) {
          room.removePlayer(socket.id);
          room.addSystemMessage(`${userData.nickname} left the room.`);
          socket.leave(room.code);
          broadcastState(room.code);
        }
        userData.roomCode = undefined;
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const userData = socketDataMap.get(socket.id);
      if (userData && userData.roomCode) {
        const room = gameManager.getRoom(userData.roomCode);
        if (room) {
          room.removePlayer(socket.id);
          broadcastState(room.code);
        }
      }
      socketDataMap.delete(socket.id);
    });
  });

  return gameManager;
}
