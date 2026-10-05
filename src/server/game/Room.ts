import { getRolesForPlayerCount, shuffleRoles, RoleDefinition } from './roleDefinitions';
import {
  GamePhase,
  PublicSeatInfo,
  RoomPublicState,
  AccusationResult,
  ChatMessage,
  TargetedEffectType,
} from '../../types/game';
import { MatchHistory } from '../../lib/server/models/MatchHistory';
import { isMongoConnected } from '../../lib/server/db';

export interface PlayerSeat {
  seatIndex: number;
  userId: string;
  socketId: string;
  sessionToken: string;
  nickname: string;
  isOwner: boolean;
  isReady: boolean;
  isConnected: boolean;
  role?: RoleDefinition;
  score: number;
  accusationTargetSeat?: number;
  lastActiveAt: number;
}

export class Room {
  public code: string;
  public ownerUserId: string;
  public maxCapacity: number;
  public chatEnabled: boolean;
  public createdAt: number;
  public lastActiveAt: number;

  public phase: GamePhase = 'LOBBY';
  public seats: (PlayerSeat | null)[] = [];

  // Match timers
  private phaseTimer: NodeJS.Timeout | null = null;
  private phaseDeadline: number = 0;
  private phaseDurationSeconds: number = 0;
  private matchDeadline: number = 0;

  // Police reveal timer
  private policeRevealTimer: NodeJS.Timeout | null = null;
  public policePubliclyRevealed: boolean = false;

  // Owner disconnect grace timer (60s)
  private ownerDisconnectTimer: NodeJS.Timeout | null = null;

  // Outcome
  public accusationResult?: AccusationResult;
  public policeSeatIndex: number = -1;
  public thiefSeatIndex: number = -1;
  public kingSeatIndex: number = -1;
  public queenSeatIndex: number = -1;
  private accusationResolved: boolean = false;

  // Room chat history (up to 50 items)
  public chatMessages: ChatMessage[] = [];

  // Callbacks
  private broadcastStateCallback: (roomCode: string) => void;
  private sendPrivateRoleCallback: (socketId: string, role: RoleDefinition) => void;
  private sendTargetedEffectCallback: (socketId: string, effectType: TargetedEffectType) => void;

  constructor(
    code: string,
    ownerUserId: string,
    maxCapacity: number = 10,
    chatEnabled: boolean = true,
    callbacks: {
      broadcastState: (roomCode: string) => void;
      sendPrivateRole: (socketId: string, role: RoleDefinition) => void;
      sendTargetedEffect: (socketId: string, effectType: TargetedEffectType) => void;
    }
  ) {
    this.code = code;
    this.ownerUserId = ownerUserId;
    this.maxCapacity = Math.max(3, Math.min(30, maxCapacity));
    this.chatEnabled = chatEnabled;
    this.createdAt = Date.now();
    this.lastActiveAt = Date.now();

    this.broadcastStateCallback = callbacks.broadcastState;
    this.sendPrivateRoleCallback = callbacks.sendPrivateRole;
    this.sendTargetedEffectCallback = callbacks.sendTargetedEffect;

    this.seats = new Array(this.maxCapacity).fill(null);
  }

  public getConnectedPlayersCount(): number {
    return this.seats.filter((s): s is PlayerSeat => s !== null && s.isConnected).length;
  }

  public getTotalOccupiedSeats(): number {
    return this.seats.filter((s): s is PlayerSeat => s !== null).length;
  }

  public findSeatByUserId(userId: string): number {
    return this.seats.findIndex((s) => s !== null && s.userId === userId);
  }

  public findSeatBySessionToken(sessionToken: string): number {
    return this.seats.findIndex((s) => s !== null && s.sessionToken === sessionToken);
  }

  public findSeatBySocketId(socketId: string): number {
    return this.seats.findIndex((s) => s !== null && s.socketId === socketId);
  }

  public addPlayer(
    userId: string,
    socketId: string,
    nickname: string,
    sessionToken: string
  ): { success: boolean; seatIndex?: number; message?: string } {
    this.lastActiveAt = Date.now();

    // Check reconnection by sessionToken or userId
    let existingIndex = this.findSeatBySessionToken(sessionToken);
    if (existingIndex === -1) {
      existingIndex = this.findSeatByUserId(userId);
    }

    if (existingIndex !== -1) {
      const existingSeat = this.seats[existingIndex]!;
      existingSeat.socketId = socketId;
      existingSeat.isConnected = true;
      existingSeat.sessionToken = sessionToken;
      if (nickname.trim()) {
        existingSeat.nickname = nickname.trim().slice(0, 20);
      }
      existingSeat.lastActiveAt = Date.now();

      // Clear owner grace timer if owner reconnected
      if (existingSeat.userId === this.ownerUserId && this.ownerDisconnectTimer) {
        clearTimeout(this.ownerDisconnectTimer);
        this.ownerDisconnectTimer = null;
      }

      // If game is in progress, re-send private role
      if (this.phase !== 'LOBBY' && existingSeat.role) {
        this.sendPrivateRoleCallback(socketId, existingSeat.role);
      }

      return { success: true, seatIndex: existingIndex };
    }

    // New player join - must be in LOBBY phase
    if (this.phase !== 'LOBBY') {
      return { success: false, message: 'Match is already in progress. New players cannot join.' };
    }

    // Find first empty seat
    const firstEmpty = this.seats.findIndex((s) => s === null);
    if (firstEmpty === -1) {
      return { success: false, message: 'Room has reached maximum capacity.' };
    }

    const isFirstSeat = this.getTotalOccupiedSeats() === 0;
    if (isFirstSeat && !this.ownerUserId) {
      this.ownerUserId = userId;
    }
    const isOwner = userId === this.ownerUserId;

    const newSeat: PlayerSeat = {
      seatIndex: firstEmpty,
      userId,
      socketId,
      sessionToken,
      nickname: nickname.trim().slice(0, 20) || `Guest_${userId.slice(-4)}`,
      isOwner,
      isReady: false,
      isConnected: true,
      score: 0,
      lastActiveAt: Date.now(),
    };

    this.seats[firstEmpty] = newSeat;
    return { success: true, seatIndex: firstEmpty };
  }

  public removePlayer(socketId: string): void {
    this.lastActiveAt = Date.now();
    const seatIndex = this.findSeatBySocketId(socketId);
    if (seatIndex === -1) return;

    const seat = this.seats[seatIndex]!;
    seat.isConnected = false;
    seat.lastActiveAt = Date.now();

    // If still in lobby, remove player completely
    if (this.phase === 'LOBBY') {
      const wasOwner = seat.userId === this.ownerUserId;
      this.seats[seatIndex] = null;

      if (wasOwner) {
        this.reassignOwner();
      }
    } else {
      // If owner disconnected during match, start 60s grace timer
      if (seat.userId === this.ownerUserId && !this.ownerDisconnectTimer) {
        this.ownerDisconnectTimer = setTimeout(() => {
          this.reassignOwner();
        }, 60000);
      }
    }
  }

  private reassignOwner(): void {
    const connectedPlayers = this.seats.filter(
      (s): s is PlayerSeat => s !== null && s.isConnected
    );

    if (connectedPlayers.length > 0) {
      const newOwner = connectedPlayers[0];
      this.ownerUserId = newOwner.userId;
      this.seats.forEach((s) => {
        if (s) s.isOwner = s.userId === this.ownerUserId;
      });
      this.addSystemMessage(`Ownership transferred to ${newOwner.nickname}.`);
      this.broadcastStateCallback(this.code);
    }
  }

  public toggleReady(userId: string): boolean {
    if (this.phase !== 'LOBBY') return false;
    const seatIndex = this.findSeatByUserId(userId);
    if (seatIndex === -1) return false;

    const seat = this.seats[seatIndex]!;
    seat.isReady = !seat.isReady;
    this.lastActiveAt = Date.now();
    return true;
  }

  public canStartMatch(): boolean {
    if (this.phase !== 'LOBBY') return false;
    const connected = this.seats.filter(
      (s): s is PlayerSeat => s !== null && s.isConnected
    );
    if (connected.length < 3) return false;
    return connected.every((s) => s.isReady);
  }

  public startMatch(requestingUserId: string): { success: boolean; message?: string } {
    if (requestingUserId !== this.ownerUserId) {
      return { success: false, message: 'Only the room owner can start the match.' };
    }
    if (!this.canStartMatch()) {
      return { success: false, message: 'Need at least 3 players and all must be ready to start.' };
    }

    const occupiedSeats = this.seats.filter(
      (s): s is PlayerSeat => s !== null && s.isConnected
    );
    const playerCount = occupiedSeats.length;

    // Get exact role set for playerCount and shuffle
    const roles = getRolesForPlayerCount(playerCount);
    const shuffledRoles = shuffleRoles(roles);

    this.policeSeatIndex = -1;
    this.thiefSeatIndex = -1;
    this.kingSeatIndex = -1;
    this.queenSeatIndex = -1;
    this.accusationResolved = false;

    // Authoritative server assignment
    occupiedSeats.forEach((seat, idx) => {
      seat.role = shuffledRoles[idx];
      seat.score = seat.role.points; // Base score
      seat.accusationTargetSeat = undefined;

      if (seat.role.name === 'Police') {
        this.policeSeatIndex = seat.seatIndex;
      }
      if (seat.role.name === 'Thief') {
        this.thiefSeatIndex = seat.seatIndex;
      }
      if (seat.role.name === 'King') {
        this.kingSeatIndex = seat.seatIndex;
      }
      if (seat.role.name === 'Queen') {
        this.queenSeatIndex = seat.seatIndex;
      }

      // Send private role ONLY to this player's socket
      this.sendPrivateRoleCallback(seat.socketId, seat.role);
    });

    // Total match deadline: 5 minutes (300 seconds) max
    this.matchDeadline = Date.now() + 300000;
    this.policePubliclyRevealed = false;
    this.accusationResult = undefined;

    // Step 1: PRIVATE_REVEAL (10s)
    this.setPhase('PRIVATE_REVEAL', 10);
    this.addSystemMessage('The match has begun! Check your secret royal scroll.');

    return { success: true };
  }

  private setPhase(newPhase: GamePhase, durationSeconds: number): void {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
    if (this.policeRevealTimer) {
      clearTimeout(this.policeRevealTimer);
      this.policeRevealTimer = null;
    }

    this.phase = newPhase;
    this.phaseDurationSeconds = durationSeconds;
    this.phaseDeadline = Date.now() + durationSeconds * 1000;

    if (newPhase === 'POLICE_REVEAL') {
      // Reveal Police after 2 seconds
      this.policeRevealTimer = setTimeout(() => {
        this.policePubliclyRevealed = true;
        const policeSeat = this.seats[this.policeSeatIndex];
        const policeName = policeSeat ? policeSeat.nickname : 'Police';
        this.addSystemMessage(`👮 ${policeName} is the Police! Find the Thief!`);
        this.broadcastStateCallback(this.code);
      }, 2000);
    }

    // Schedule next phase transition
    this.phaseTimer = setTimeout(() => {
      this.handlePhaseTimeout();
    }, durationSeconds * 1000);

    this.broadcastStateCallback(this.code);
  }

  private handlePhaseTimeout(): void {
    const playerCount = this.getConnectedPlayersCount();
    const accusationDuration = playerCount <= 10 ? 30 : playerCount <= 20 ? 35 : 40;

    switch (this.phase) {
      case 'PRIVATE_REVEAL':
        this.setPhase('POLICE_REVEAL', 5);
        break;

      case 'POLICE_REVEAL': {
        this.policePubliclyRevealed = true;
        // Discussion duration: total 300s minus all other phases
        // private(10) + police(5) + discussion + accusation + effect(5) + throne(15) <= 300
        const otherPhases = 10 + 5 + accusationDuration + 5 + 15;
        const discussionDuration = Math.min(60, Math.max(20, 300 - otherPhases));
        this.setPhase('DISCUSSION', discussionDuration);
        this.addSystemMessage('Discussion phase: Interrogate suspects and read the room!');
        break;
      }

      case 'DISCUSSION':
        this.setPhase('ACCUSATION', accusationDuration);
        this.addSystemMessage('Accusation phase! Police, tap your suspect to make an accusation!');
        break;

      case 'ACCUSATION':
        // Accusation timed out
        this.resolveAccusation(-1, true);
        break;

      case 'EFFECT':
        this.setPhase('THRONE', 15);
        const kingSeat = this.seats[this.kingSeatIndex];
        const queenSeat = this.queenSeatIndex >= 0 ? this.seats[this.queenSeatIndex] : null;
        const kingName = kingSeat ? kingSeat.nickname : 'The King';
        const queenName = queenSeat ? queenSeat.nickname : 'The Queen';
        if (queenSeat) {
          this.addSystemMessage(`👑 All hail King ${kingName} and Queen ${queenName}! Approaching the Royal Thrones!`);
        } else {
          this.addSystemMessage(`👑 All hail King ${kingName}! Approaching the Royal Throne!`);
        }
        break;

      case 'THRONE':
        this.phase = 'RESULTS';
        this.phaseDeadline = 0;
        this.phaseDurationSeconds = 0;
        this.recordMatchResults();
        this.broadcastStateCallback(this.code);
        break;

      default:
        break;
    }
  }

  public submitAccusation(
    policeUserId: string,
    targetSeatIndex: number
  ): { success: boolean; message?: string } {
    if (this.phase !== 'ACCUSATION') {
      return { success: false, message: 'Accusations can only be made during the Accusation phase.' };
    }

    if (this.accusationResolved) {
      return { success: false, message: 'Accusation has already been submitted.' };
    }

    const policeSeat = this.seats[this.policeSeatIndex];
    if (!policeSeat || policeSeat.userId !== policeUserId) {
      return { success: false, message: 'Only the Police may make an accusation.' };
    }

    if (
      targetSeatIndex < 0 ||
      targetSeatIndex >= this.seats.length ||
      !this.seats[targetSeatIndex] ||
      !this.seats[targetSeatIndex]?.isConnected
    ) {
      return { success: false, message: 'Invalid target seat. Must be an occupied, connected player.' };
    }

    if (targetSeatIndex === this.policeSeatIndex) {
      return { success: false, message: 'Police cannot accuse themselves.' };
    }

    policeSeat.accusationTargetSeat = targetSeatIndex;
    this.resolveAccusation(targetSeatIndex, false);
    return { success: true };
  }

  private resolveAccusation(targetSeatIndex: number, isTimeout: boolean): void {
    if (this.accusationResolved) return;
    this.accusationResolved = true;

    const policeSeat = this.policeSeatIndex >= 0 ? this.seats[this.policeSeatIndex] : null;
    const thiefSeat = this.thiefSeatIndex >= 0 ? this.seats[this.thiefSeatIndex] : null;
    const targetSeat = targetSeatIndex >= 0 ? this.seats[targetSeatIndex] : null;

    const isCorrect = !isTimeout && targetSeatIndex === this.thiefSeatIndex;

    this.accusationResult = {
      policeSeat: this.policeSeatIndex,
      policeNickname: policeSeat ? policeSeat.nickname : 'Police',
      targetSeat: targetSeatIndex,
      targetNickname: targetSeat ? targetSeat.nickname : 'Nobody (Timeout)',
      isCorrect,
      isTimeout,
      thiefSeat: this.thiefSeatIndex,
      thiefNickname: thiefSeat ? thiefSeat.nickname : 'Thief',
    };

    // Authoritative scoring:
    // Correct accusation: Police 1,000 points; Thief 0.
    // Wrong accusation or timeout: Police 0; Thief 1,000.
    if (isCorrect) {
      if (policeSeat) policeSeat.score = 1000;
      if (thiefSeat) thiefSeat.score = 0;
    } else {
      if (policeSeat) policeSeat.score = 0;
      if (thiefSeat) thiefSeat.score = 1000;
    }

    // Advance immediately to EFFECT phase (5 seconds)
    this.setPhase('EFFECT', 5);

    // Send targeted visual effects to sockets:
    // Correct accusation triggers gunshot impact effect ONLY for Thief.
    // Wrong accusation or timeout triggers grenade impact effect ONLY for Police.
    this.seats.forEach((seat) => {
      if (!seat || !seat.isConnected) return;

      if (isCorrect) {
        if (seat.seatIndex === this.thiefSeatIndex) {
          this.sendTargetedEffectCallback(seat.socketId, 'gunshot');
        } else {
          this.sendTargetedEffectCallback(seat.socketId, 'neutral');
        }
      } else {
        if (seat.seatIndex === this.policeSeatIndex) {
          this.sendTargetedEffectCallback(seat.socketId, 'grenade');
        } else {
          this.sendTargetedEffectCallback(seat.socketId, 'neutral');
        }
      }
    });

    this.broadcastStateCallback(this.code);
  }

  private async recordMatchResults(): Promise<void> {
    if (!isMongoConnected) return;

    try {
      const kingSeat = this.kingSeatIndex >= 0 ? this.seats[this.kingSeatIndex] : null;
      const matchDoc = new MatchHistory({
        roomCode: this.code,
        totalPlayers: this.getConnectedPlayersCount(),
        durationSeconds: Math.floor((Date.now() - (this.matchDeadline - 300000)) / 1000),
        policeSuccess: this.accusationResult?.isCorrect ?? false,
        thiefCaught: this.accusationResult?.isCorrect ?? false,
        royalWinner: kingSeat ? kingSeat.nickname : 'King',
        players: this.seats
          .filter((s): s is PlayerSeat => s !== null)
          .map((s) => ({
            userId: s.userId,
            nickname: s.nickname,
            roleId: s.role?.id ?? 0,
            roleName: s.role?.name ?? 'Unknown',
            score: s.score,
          })),
      });
      await matchDoc.save();
    } catch (err) {
      console.warn('[Room] Could not save match history to MongoDB:', err);
    }
  }

  public resetForRematch(requestingUserId: string): { success: boolean; message?: string } {
    if (requestingUserId !== this.ownerUserId) {
      return { success: false, message: 'Only the room owner can reset for a rematch.' };
    }

    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
    if (this.policeRevealTimer) {
      clearTimeout(this.policeRevealTimer);
      this.policeRevealTimer = null;
    }

    this.phase = 'LOBBY';
    this.phaseDeadline = 0;
    this.phaseDurationSeconds = 0;
    this.policePubliclyRevealed = false;
    this.accusationResult = undefined;
    this.policeSeatIndex = -1;
    this.thiefSeatIndex = -1;
    this.kingSeatIndex = -1;
    this.queenSeatIndex = -1;
    this.accusationResolved = false;

    // Reset readiness, keep seated players
    this.seats.forEach((seat) => {
      if (seat) {
        seat.isReady = false;
        seat.role = undefined;
        seat.score = 0;
        seat.accusationTargetSeat = undefined;
      }
    });

    this.addSystemMessage('Room reset for rematch! Mark ready when prepared.');
    this.broadcastStateCallback(this.code);
    return { success: true };
  }

  public addChatMessage(senderUserId: string, text: string): { success: boolean; message?: string } {
    if (!this.chatEnabled) {
      return { success: false, message: 'Chat is disabled for this room.' };
    }

    const seat = this.seats.find((s): s is PlayerSeat => s !== null && s.userId === senderUserId);
    if (!seat) {
      return { success: false, message: 'You are not seated in this room.' };
    }

    const cleanText = text.trim().slice(0, 150);
    if (!cleanText) return { success: false };

    const chatMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderNickname: seat.nickname,
      senderUserId,
      text: cleanText,
      timestamp: Date.now(),
    };

    this.chatMessages.push(chatMsg);
    if (this.chatMessages.length > 50) {
      this.chatMessages.shift();
    }

    return { success: true };
  }

  public addSystemMessage(text: string): void {
    const chatMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderNickname: 'Royal Herald',
      senderUserId: 'system',
      text,
      timestamp: Date.now(),
      isSystem: true,
    };
    this.chatMessages.push(chatMsg);
    if (this.chatMessages.length > 50) {
      this.chatMessages.shift();
    }
  }

  public getPublicState(): RoomPublicState {
    const now = Date.now();
    const phaseTimeRemaining = Math.max(0, Math.ceil((this.phaseDeadline - now) / 1000));
    const overallMatchTimeRemaining =
      this.phase === 'LOBBY' || this.phase === 'RESULTS'
        ? 0
        : Math.max(0, Math.ceil((this.matchDeadline - now) / 1000));

    const allRolesRevealed = this.phase === 'THRONE' || this.phase === 'RESULTS';

    const publicSeats: (PublicSeatInfo | null)[] = this.seats.map((seat) => {
      if (!seat) return null;

      const isPolice = this.policePubliclyRevealed && seat.seatIndex === this.policeSeatIndex;

      const pub: PublicSeatInfo = {
        seatIndex: seat.seatIndex,
        userId: seat.userId,
        nickname: seat.nickname,
        isOwner: seat.isOwner,
        isReady: seat.isReady,
        isConnected: seat.isConnected,
        isPoliceRevealed: isPolice,
      };

      if (allRolesRevealed && seat.role) {
        pub.revealedRole = {
          id: seat.role.id,
          name: seat.role.name,
          tamilName: seat.role.tamilName,
          points: seat.role.points,
          hasCrown: seat.role.hasCrown,
          category: seat.role.category,
        };
        pub.finalScore = seat.score;
      }

      return pub;
    });

    return {
      roomCode: this.code,
      ownerUserId: this.ownerUserId,
      maxCapacity: this.maxCapacity,
      chatEnabled: this.chatEnabled,
      phase: this.phase,
      phaseDeadline: this.phaseDeadline,
      phaseTimeRemaining,
      phaseDuration: this.phaseDurationSeconds,
      overallMatchDeadline: this.matchDeadline,
      overallMatchTimeRemaining,
      seats: publicSeats,
      policePlayerSeat: this.policePubliclyRevealed ? this.policeSeatIndex : undefined,
      kingPlayerSeat: allRolesRevealed ? this.kingSeatIndex : undefined,
      queenPlayerSeat: allRolesRevealed && this.queenSeatIndex >= 0 ? this.queenSeatIndex : undefined,
      accusationResult:
        allRolesRevealed || this.phase === 'EFFECT' ? this.accusationResult : undefined,
      allRolesRevealed,
      canStart: this.canStartMatch(),
    };
  }

  public destroy(): void {
    if (this.phaseTimer) clearTimeout(this.phaseTimer);
    if (this.policeRevealTimer) clearTimeout(this.policeRevealTimer);
    if (this.ownerDisconnectTimer) clearTimeout(this.ownerDisconnectTimer);
  }
}
