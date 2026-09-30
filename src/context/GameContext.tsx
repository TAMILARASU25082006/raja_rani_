import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { RoomPublicState, RoleInfo, ChatMessage } from '../types/game';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { soundFx } from '../services/soundEffects';

interface GameContextType {
  roomState: RoomPublicState | null;
  myPrivateRole: RoleInfo | null;
  mySeatIndex: number;
  isOwner: boolean;
  chatMessages: ChatMessage[];
  activeEffect: 'gunshot' | 'grenade' | 'neutral' | null;
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
  const { user, token, guestId, syncServerIdentity } = useAuth();
  const [roomState, setRoomState] = useState<RoomPublicState | null>(null);
  const [myPrivateRole, setMyPrivateRole] = useState<RoleInfo | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeEffect, setActiveEffect] = useState<'gunshot' | 'grenade' | 'neutral' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSuspectSeat, setSelectedSuspectSeat] = useState<number | null>(null);
  const [showCastleEntrance, setShowCastleEntrance] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [isSocketAuthenticated, setIsSocketAuthenticated] = useState<boolean>(false);

  const socket = getSocket();
  const currentRoomCodeRef = useRef<string | null>(null);

  // Keep room code ref synced for reconnection auto-join
  useEffect(() => {
    currentRoomCodeRef.current = roomState ? roomState.roomCode : null;
  }, [roomState]);

  // Clean state when user logs out
  useEffect(() => {
    if (!user) {
      setRoomState(null);
      setMyPrivateRole(null);
      setSelectedSuspectSeat(null);
      setActiveEffect(null);
      setChatMessages([]);
      setIsSocketAuthenticated(false);
    }
  }, [user]);

  // Socket Lifecycle & Reconnection
  useEffect(() => {
    const doAuthenticate = () => {
      if (user) {
        socket.emit('authenticate', {
          token: token || null,
          guestId: guestId || user.id,
          nickname: user.nickname,
        });
      }
    };

    const handleConnect = () => {
      setIsSocketConnected(true);
      doAuthenticate();
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
      setIsSocketAuthenticated(false);
    };

    const handleAuthSuccess = (data: { userId: string; nickname: string; isGuest: boolean }) => {
      setIsSocketAuthenticated(true);
      syncServerIdentity(data.userId, data.nickname);

      // If user was previously in a room before a disconnect, re-join it
      if (currentRoomCodeRef.current) {
        socket.emit('join_room', { roomCode: currentRoomCodeRef.current });
      }
    };

    const handleAuthError = (data: { message: string }) => {
      setIsSocketAuthenticated(false);
      setErrorMessage(data.message || 'Authentication error.');
    };

    const handleRoomState = (state: RoomPublicState) => {
      setRoomState((prevState) => {
        if (prevState && prevState.phase !== state.phase) {
          if (state.phase === 'PRIVATE_REVEAL') {
            soundFx.playCardFlip();
          } else if (state.phase === 'POLICE_REVEAL' || state.phase === 'THRONE') {
            soundFx.playFanfare();
          } else if (state.phase === 'DISCUSSION' || state.phase === 'ACCUSATION') {
            soundFx.playTick();
          }
        }
        return state;
      });
    };

    const handlePrivateRole = (role: RoleInfo) => {
      setMyPrivateRole(role);
      soundFx.playCardFlip();
    };

    const handleTargetedEffect = (data: { effectType: 'gunshot' | 'grenade' | 'neutral' }) => {
      setActiveEffect(data.effectType);
      if (data.effectType === 'gunshot') {
        soundFx.playGunshot();
      } else if (data.effectType === 'grenade') {
        soundFx.playGrenade();
      }

      setTimeout(() => {
        setActiveEffect(null);
      }, 4800);
    };

    const handleChatMessages = (messages: ChatMessage[]) => {
      setChatMessages(messages);
    };

    const handleActionError = (data: { message: string }) => {
      setErrorMessage(data.message || 'An unexpected error occurred.');
    };

    const handleRoomJoined = () => {
      setShowCastleEntrance(true);
      soundFx.playFanfare();
      setTimeout(() => {
        setShowCastleEntrance(false);
      }, 2500);
    };

    // Attach listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('auth_success', handleAuthSuccess);
    socket.on('auth_error', handleAuthError);
    socket.on('room_state_update', handleRoomState);
    socket.on('private_role_assigned', handlePrivateRole);
    socket.on('targeted_effect_trigger', handleTargetedEffect);
    socket.on('chat_messages_update', handleChatMessages);
    socket.on('action_error', handleActionError);
    socket.on('room_joined', handleRoomJoined);
    socket.on('room_created', handleRoomJoined);

    if (!socket.connected) {
      socket.connect();
    } else {
      setIsSocketConnected(true);
      doAuthenticate();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('auth_success', handleAuthSuccess);
      socket.off('auth_error', handleAuthError);
      socket.off('room_state_update', handleRoomState);
      socket.off('private_role_assigned', handlePrivateRole);
      socket.off('targeted_effect_trigger', handleTargetedEffect);
      socket.off('chat_messages_update', handleChatMessages);
      socket.off('action_error', handleActionError);
      socket.off('room_joined', handleRoomJoined);
      socket.off('room_created', handleRoomJoined);
    };
  }, [user, token, guestId, socket, syncServerIdentity]);

  // Derived user attributes
  const mySeatIndex = roomState && user
    ? roomState.seats.findIndex((s) => s !== null && s.userId === user.id)
    : -1;

  const isOwner = roomState && user ? roomState.ownerUserId === user.id : false;

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const createRoom = useCallback((maxCapacity: number = 10, chatEnabled: boolean = true) => {
    soundFx.playClick();
    socket.emit('create_room', { maxCapacity, chatEnabled });
  }, [socket]);

  const joinRoom = useCallback((roomCode: string) => {
    soundFx.playClick();
    socket.emit('join_room', { roomCode });
  }, [socket]);

  const toggleReady = useCallback(() => {
    soundFx.playClick();
    socket.emit('toggle_ready');
  }, [socket]);

  const startMatch = useCallback(() => {
    soundFx.playFanfare();
    socket.emit('start_match');
  }, [socket]);

  const submitAccusation = useCallback((targetSeatIndex: number) => {
    soundFx.playClick();
    socket.emit('submit_accusation', { targetSeatIndex });
  }, [socket]);

  const playAgain = useCallback(() => {
    soundFx.playClick();
    setMyPrivateRole(null);
    setSelectedSuspectSeat(null);
    setActiveEffect(null);
    socket.emit('play_again');
  }, [socket]);

  const sendChat = useCallback((text: string) => {
    soundFx.playClick();
    socket.emit('send_chat', { text });
  }, [socket]);

  const leaveRoom = useCallback(() => {
    soundFx.playClick();
    socket.emit('leave_room');
    setRoomState(null);
    setMyPrivateRole(null);
    setSelectedSuspectSeat(null);
    setActiveEffect(null);
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
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
