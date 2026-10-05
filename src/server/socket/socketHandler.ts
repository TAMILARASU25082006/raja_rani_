import { Server, Socket } from 'socket.io';
import crypto from 'crypto';
import { GameManager } from '../game/GameManager';
import { RoleDefinition } from '../game/roleDefinitions';
import { TargetedEffectType } from '../../types/game';

interface SocketUserData {
  userId: string;
  sessionToken: string;
  nickname: string;
  roomCode?: string;
  lastMessageTime?: number;
}

export function setupSocketHandlers(io: Server): GameManager {
  const socketDataMap = new Map<string, SocketUserData>();
  const sessionTokenToUserMap = new Map<string, { userId: string; nickname: string }>();

  // Broadcast state to room
  const broadcastState = (roomCode: string) => {
    const room = gameManager.getRoom(roomCode);
    if (!room) return;
    const publicState = room.getPublicState();
    io.to(roomCode).emit('room_state_update', publicState);
    io.to(roomCode).emit('chat_messages_update', room.chatMessages);
  };

  // Private secret role sender
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

  // Targeted visual effect sender
  const sendTargetedEffect = (socketId: string, effectType: TargetedEffectType) => {
    io.to(socketId).emit('targeted_effect_trigger', { effectType });
  };

  const gameManager = new GameManager({
    broadcastState,
    sendPrivateRole,
    sendTargetedEffect,
  });

  io.on('connection', (socket: Socket) => {
    // Helper to generate or restore secure unguessable session credential
    const ensureUserData = (authData?: { sessionToken?: string | null; nickname?: string | null }): SocketUserData => {
      let userData = socketDataMap.get(socket.id);
      if (userData) return userData;

      let sessionToken = authData?.sessionToken?.trim() || '';
      let userId: string;
      let nickname = authData?.nickname?.trim().slice(0, 20) || '';

      if (sessionToken && sessionTokenToUserMap.has(sessionToken)) {
        // Valid existing session restored
        const saved = sessionTokenToUserMap.get(sessionToken)!;
        userId = saved.userId;
        if (!nickname) {
          nickname = saved.nickname;
        } else {
          saved.nickname = nickname;
        }
      } else {
        // Generate new unguessable session credential on the server
        sessionToken = 'sess_' + crypto.randomBytes(24).toString('hex');
        userId = 'usr_' + crypto.randomBytes(12).toString('hex');
        if (!nickname) {
          nickname = 'Player_' + userId.slice(-4);
        }
        sessionTokenToUserMap.set(sessionToken, { userId, nickname });
      }

      userData = {
        userId,
        sessionToken,
        nickname,
      };

      socketDataMap.set(socket.id, userData);
      socket.emit('auth_success', {
        userId,
        nickname,
        sessionToken,
      });

      return userData;
    };

    // Explicit authenticate event
    socket.on('authenticate', (data: { sessionToken?: string | null; nickname?: string | null }) => {
      ensureUserData(data);
    });

    // Create room
    socket.on(
      'create_room',
      (data: { maxCapacity?: number; chatEnabled?: boolean; sessionToken?: string; nickname?: string }) => {
        const userData = ensureUserData(data);
        if (data.nickname?.trim()) {
          userData.nickname = data.nickname.trim().slice(0, 20);
        }

        const capacity = data?.maxCapacity ? Math.max(3, Math.min(30, data.maxCapacity)) : 10;
        const chatEnabled = data?.chatEnabled !== false;

        const room = gameManager.createRoom(userData.userId, capacity, chatEnabled);
        const joinResult = room.addPlayer(userData.userId, socket.id, userData.nickname, userData.sessionToken);

        if (joinResult.success) {
          userData.roomCode = room.code;
          socket.join(room.code);
          socket.emit('room_created', { roomCode: room.code });
          broadcastState(room.code);
        } else {
          socket.emit('action_error', { message: joinResult.message || 'Failed to initialize seat in room.' });
        }
      }
    );

    // Join room
    socket.on(
      'join_room',
      (data: { roomCode: string; sessionToken?: string; nickname?: string }) => {
        const userData = ensureUserData(data);
        if (data.nickname?.trim()) {
          userData.nickname = data.nickname.trim().slice(0, 20);
        }

        const code = data?.roomCode ? data.roomCode.toUpperCase().trim() : '';
        const room = gameManager.getRoom(code);
        if (!room) {
          socket.emit('action_error', { message: `Room "${code}" does not exist. Please check the code.` });
          return;
        }

        const joinResult = room.addPlayer(userData.userId, socket.id, userData.nickname, userData.sessionToken);
        if (!joinResult.success) {
          socket.emit('action_error', { message: joinResult.message });
          return;
        }

        userData.roomCode = room.code;
        socket.join(room.code);
        socket.emit('room_joined', { roomCode: room.code, seatIndex: joinResult.seatIndex });
        room.addSystemMessage(`${userData.nickname} entered the palace hall.`);
        broadcastState(room.code);
      }
    );

    // Toggle Ready
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

    // Accusation (Police only)
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

    // Play again / Rematch (owner only)
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

    // Chat
    socket.on('send_chat', (data: { text: string }) => {
      const userData = socketDataMap.get(socket.id);
      if (!userData || !userData.roomCode) return;

      const room = gameManager.getRoom(userData.roomCode);
      if (!room) return;

      // Rate limit: 1 msg per 400ms
      const now = Date.now();
      if (userData.lastMessageTime && now - userData.lastMessageTime < 400) {
        socket.emit('action_error', { message: 'Sending messages too fast.' });
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

    // Disconnect
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
