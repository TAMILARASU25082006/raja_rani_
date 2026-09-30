export type GamePhase =
  | 'LOBBY'
  | 'PRIVATE_REVEAL'
  | 'POLICE_REVEAL'
  | 'DISCUSSION'
  | 'ACCUSATION'
  | 'EFFECT'
  | 'THRONE'
  | 'RESULTS';

export interface RoleInfo {
  id: number;
  name: string;
  tamilName: string;
  points: number;
  description?: string;
  tamilDescription?: string;
  hasCrown: boolean;
  category?: 'royalty' | 'enforcer' | 'court' | 'military' | 'artisan' | 'citizen';
}

export interface PublicSeatInfo {
  seatIndex: number;
  userId: string;
  nickname: string;
  isOwner: boolean;
  isReady: boolean;
  isConnected: boolean;
  isPoliceRevealed?: boolean;
  revealedRole?: RoleInfo;
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
  policePlayerSeat?: number;
  kingPlayerSeat?: number;
  accusationResult?: AccusationResult;
  allRolesRevealed: boolean;
  canStart: boolean;
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  gamesPlayed: number;
  totalScore: number;
  wins: number;
}
