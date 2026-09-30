import { RoleDefinition } from './roleDefinitions.js';

export type GamePhase =
  | 'LOBBY'
  | 'PRIVATE_REVEAL'
  | 'POLICE_REVEAL'
  | 'DISCUSSION'
  | 'ACCUSATION'
  | 'EFFECT'
  | 'THRONE'
  | 'RESULTS';

export interface PlayerSeat {
  seatIndex: number;
  userId: string;
  socketId: string;
  nickname: string;
  isOwner: boolean;
  isReady: boolean;
  isConnected: boolean;
  joinedAt: number;
  lastActiveAt: number;
  // Private to server until results
  role?: RoleDefinition;
  score: number;
  accusationTargetSeat?: number;
}

export interface PublicSeatInfo {
  seatIndex: number;
  userId: string;
  nickname: string;
  isOwner: boolean;
  isReady: boolean;
  isConnected: boolean;
  // Revealed conditionally
  isPoliceRevealed?: boolean;
  // Only revealed in THRONE / RESULTS
  revealedRole?: {
    id: number;
    name: string;
    tamilName: string;
    points: number;
    hasCrown: boolean;
  };
  finalScore?: number;
}

export interface ChatMessage {
  id: string;
  senderNickname: string;
  senderUserId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface RoomSettings {
  maxCapacity: number;
  chatEnabled: boolean;
}

export interface AccusationResult {
  policeSeat: number;
  policeNickname: string;
  targetSeat: number;
  targetNickname: string;
  isCorrect: boolean;
  isTimeout: boolean;
  thiefSeat: number;
  thiefNickname: string;
}

export interface RoomPublicState {
  roomCode: string;
  ownerUserId: string;
  maxCapacity: number;
  chatEnabled: boolean;
  phase: GamePhase;
  phaseTimeRemaining: number;
  phaseDuration: number;
  overallMatchTimeRemaining: number;
  seats: (PublicSeatInfo | null)[];
  policePlayerSeat?: number; // Publicly announced in POLICE_REVEAL
  kingPlayerSeat?: number;   // Publicly announced in THRONE & RESULTS
  accusationResult?: AccusationResult;
  allRolesRevealed: boolean;
  canStart: boolean;
}
