'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoomPublicState, RoleInfo, ChatMessage, TargetedEffectType } from '../types/game';
import { getSocket } from '../lib/client/socket';
import { clientStorage } from '../lib/client/storage';
import { soundFx } from '../services/soundEffects';

interface PlayerUser {
  userId: string;
  nickname: string;
  sessionToken: string;
}

interface GameContextType {
  user: PlayerUser | null;
  nickname: string;
  setNickname: (name: string) => void;
  roomState: RoomPublicState | null;
  myPrivateRole: RoleInfo | null;
  mySeatIndex: number;
  isOwner: boolean;
  chatMessages: ChatMessage[];
  activeEffect: TargetedEffectType | null;
  errorMessage: string | null;
  selectedSuspectSeat: number | null;
  showCastleEntrance: boolean;
  isSocketConnected: boolean;
  isSocketAuthenticated: boolean;
  setSelectedSuspectSeat: (seatIndex: number | null) => void;
  clearErrorMessage: () => void;
  createRoom: (maxCapacity?: number, chatEnabled?: boolean) => void;
  joinRoom: (roomCode: string) => void;
  toggleReady: () => void;
  startMatch: () => void;
  submitAccusation: (targetSeatIndex: number) => void;
  playAgain: () => void;
  sendChat: (text: string) => void;
  leaveRoom: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState<PlayerUser | null>(null);
  const [nickname, setNicknameState] = useState<string>('');
  const [roomState, setRoomState] = useState<RoomPublicState | null>(null);
  const [myPrivateRole, setMyPrivateRole] = useState<RoleInfo | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeEffect, setActiveEffect] = useState<TargetedEffectType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSuspectSeat, setSelectedSuspectSeat] = useState<number | null>(null);
  const [showCastleEntrance, setShowCastleEntrance] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [isSocketAuthenticated, setIsSocketAuthenticated] = useState<boolean>(false);

  const prevPhaseRef = useRef<string | null>(null);
  const currentRoomCodeRef = useRef<string | null>(null);
  const isLeavingRef = useRef<boolean>(false);

  // Initialize stored nickname and session token on mount
  useEffect(() => {
    const savedNick = clientStorage.getNickname();
    const savedToken = clientStorage.getSessionToken();
    if (savedNick) {
      setNicknameState(savedNick);
    }
    if (savedToken) {
      setUser({
        userId: '',
        nickname: savedNick || 'Royal Guest',
        sessionToken: savedToken,
      });
    }
  }, []);

  const setNickname = useCallback((name: string) => {
    const clean = name.trim().slice(0, 20);
    setNicknameState(clean);
    clientStorage.setNickname(clean);
    setUser((prev) =>
      prev
        ? { ...prev, nickname: clean }
        : { userId: '', nickname: clean, sessionToken: clientStorage.getSessionToken() }
    );

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('authenticate', {
        sessionToken: clientStorage.getSessionToken(),
        nickname: clean,
      });
    }
  }, []);

  // Update room code ref
  useEffect(() => {
    currentRoomCodeRef.current = roomState ? roomState.roomCode : null;
  }, [roomState]);

  // Setup Socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => {
      setIsSocketConnected(true);
      const token = clientStorage.getSessionToken();
      const nick = clientStorage.getNickname();
      socket.emit('authenticate', {
        sessionToken: token || undefined,
        nickname: nick || undefined,
      });
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
      setIsSocketAuthenticated(false);
    };

    const handleAuthSuccess = (data: { userId: string; nickname: string; sessionToken: string }) => {
      setIsSocketAuthenticated(true);
      setUser({
        userId: data.userId,
        nickname: data.nickname,
        sessionToken: data.sessionToken,
      });
      clientStorage.setSessionToken(data.sessionToken);
      if (data.nickname) {
        setNicknameState(data.nickname);
        clientStorage.setNickname(data.nickname);
      }

      // If reconnected while having a roomCode, re-join seamlessly
      if (currentRoomCodeRef.current) {
        socket.emit('join_room', {
          roomCode: currentRoomCodeRef.current,
          sessionToken: data.sessionToken,
          nickname: data.nickname,
        });
      }
    };

    const handleRoomCreated = (data: { roomCode: string }) => {
      setShowCastleEntrance(true);
      soundFx.playClick();
      router.push(`/room/${data.roomCode}`);
      setTimeout(() => setShowCastleEntrance(false), 1400);
    };

    const handleRoomJoined = (data: { roomCode: string }) => {
      if (isLeavingRef.current) return;
      setShowCastleEntrance(true);
      soundFx.playClick();
      router.push(`/room/${data.roomCode}`);
      setTimeout(() => setShowCastleEntrance(false), 1400);
    };

    const handleRoomStateUpdate = (newState: RoomPublicState) => {
      if (isLeavingRef.current) return;
      setRoomState((prevState) => {
        // Sound & phase transition effects
        if (prevState?.phase !== newState.phase) {
          if (newState.phase === 'PRIVATE_REVEAL') {
            soundFx.playCardFlip();
          } else if (newState.phase === 'POLICE_REVEAL') {
            soundFx.playClick();
          } else if (newState.phase === 'THRONE' || newState.phase === 'RESULTS') {
            soundFx.playFanfare();
          } else if (newState.phase === 'ACCUSATION') {
            soundFx.playClick();
          }
        }
        return newState;
      });

      // Clear suspect selection if leaving accusation
      if (newState.phase !== 'ACCUSATION') {
        setSelectedSuspectSeat(null);
      }
    };

    const handlePrivateRole = (role: RoleInfo) => {
      setMyPrivateRole(role);
      soundFx.playCardFlip();
    };

    const handleTargetedEffect = (data: { effectType: TargetedEffectType }) => {
      setActiveEffect(data.effectType);
      if (data.effectType === 'gunshot') {
        soundFx.playGunshot();
      } else if (data.effectType === 'grenade') {
        soundFx.playGrenade();
      }

      setTimeout(() => {
        setActiveEffect(null);
      }, 4500);
    };

    const handleChatUpdate = (msgs: ChatMessage[]) => {
      setChatMessages(msgs);
    };

    const handleActionError = (data: { message: string }) => {
      setErrorMessage(data.message || 'An error occurred.');
      soundFx.playClick();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('auth_success', handleAuthSuccess);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
    socket.on('room_state_update', handleRoomStateUpdate);
    socket.on('private_role_assigned', handlePrivateRole);
    socket.on('targeted_effect_trigger', handleTargetedEffect);
    socket.on('chat_messages_update', handleChatUpdate);
    socket.on('action_error', handleActionError);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('auth_success', handleAuthSuccess);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
      socket.off('room_state_update', handleRoomStateUpdate);
      socket.off('private_role_assigned', handlePrivateRole);
      socket.off('targeted_effect_trigger', handleTargetedEffect);
      socket.off('chat_messages_update', handleChatUpdate);
      socket.off('action_error', handleActionError);
    };
  }, [router]);

  // Derived user states
  const mySeatIndex =
    roomState && user
      ? roomState.seats.findIndex((s) => s !== null && s.userId === user.userId)
      : -1;

  const isOwner =
    roomState && user
      ? roomState.ownerUserId === user.userId
      : false;

  const clearErrorMessage = () => setErrorMessage(null);

  const createRoom = (maxCapacity: number = 10, chatEnabled: boolean = true) => {
    isLeavingRef.current = false;
    const socket = getSocket();
    if (!socket) return;
    const token = clientStorage.getSessionToken();
    const nick = nickname || clientStorage.getNickname();
    socket.emit('create_room', {
      maxCapacity,
      chatEnabled,
      sessionToken: token || undefined,
      nickname: nick || undefined,
    });
  };

  const joinRoom = (roomCode: string) => {
    if (isLeavingRef.current) return;
    const socket = getSocket();
    if (!socket) return;
    const cleanCode = roomCode.toUpperCase().trim();
    if (!cleanCode) return;
    const token = clientStorage.getSessionToken();
    const nick = nickname || clientStorage.getNickname();
    socket.emit('join_room', {
      roomCode: cleanCode,
      sessionToken: token || undefined,
      nickname: nick || undefined,
    });
  };

  const toggleReady = () => {
    const socket = getSocket();
    if (!socket) return;
    soundFx.playClick();
    socket.emit('toggle_ready');
  };

  const startMatch = () => {
    const socket = getSocket();
    if (!socket) return;
    soundFx.playFanfare();
    socket.emit('start_match');
  };

  const submitAccusation = (targetSeatIndex: number) => {
    const socket = getSocket();
    if (!socket) return;
    soundFx.playClick();
    socket.emit('submit_accusation', { targetSeatIndex });
  };

  const playAgain = () => {
    const socket = getSocket();
    if (!socket) return;
    soundFx.playClick();
    socket.emit('play_again');
  };

  const sendChat = (text: string) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('send_chat', { text });
  };

  const leaveRoom = () => {
    isLeavingRef.current = true;
    currentRoomCodeRef.current = null;
    soundFx.playClick();

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('leave_room');
    }

    setRoomState(null);
    setMyPrivateRole(null);
    setChatMessages([]);
    setSelectedSuspectSeat(null);
    setErrorMessage(null);

    // Navigate cleanly to home page
    router.push('/');
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/room/')) {
        window.location.href = '/';
      }
    }, 200);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        nickname,
        setNickname,
        roomState,
        myPrivateRole,
        mySeatIndex,
        isOwner,
        chatMessages,
        activeEffect,
        errorMessage,
        selectedSuspectSeat,
        showCastleEntrance,
        isSocketConnected,
        isSocketAuthenticated,
        setSelectedSuspectSeat,
        clearErrorMessage,
        createRoom,
        joinRoom,
        toggleReady,
        startMatch,
        submitAccusation,
        playAgain,
        sendChat,
        leaveRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
