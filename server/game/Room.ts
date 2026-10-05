import { getRolesForPlayerCount, shuffleRoles, RoleDefinition } from './roleDefinitions.js';
import { GamePhase, PlayerSeat, PublicSeatInfo, RoomPublicState, AccusationResult, ChatMessage } from './types.js';
import { MatchHistory } from '../models/MatchHistory.js';
import { User } from '../models/User.js';
import { isMongoConnected } from '../db.js';

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

  // Owner disconnect timer (60s grace period)
  private ownerDisconnectTimer: NodeJS.Timeout | null = null;

  // Outcome
  public accusationResult?: AccusationResult;
  public policeSeatIndex: number = -1;
  public thiefSeatIndex: number = -1;
  public kingSeatIndex: number = -1;

  // Room chat history (up to 50 items)
  public chatMessages: ChatMessage[] = [];

  // Broadcast callback passed from GameManager / SocketHandler
  private broadcastStateCallback: (roomCode: string) => void;
  private sendPrivateRoleCallback: (socketId: string, role: RoleDefinition) => void;
  private sendTargetedEffectCallback: (socketId: string, effectType: 'gunshot' | 'grenade' | 'neutral') => void;

  constructor(
    code: string,
    ownerUserId: string,
    maxCapacity: number = 10,
    chatEnabled: boolean = true,
    callbacks: {
      broadcastState: (roomCode: string) => void;
      sendPrivateRole: (socketId: string, role: RoleDefinition) => void;
      sendTargetedEffect: (socketId: string, effectType: 'gunshot' | 'grenade' | 'neutral') => void;
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

    // Initialize empty seats array of maxCapacity length
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

  public findSeatBySocketId(socketId: string): number {
    return this.seats.findIndex((s) => s !== null && s.socketId === socketId);
  }

  public addPlayer(userId: string, socketId: string, nickname: string): { success: boolean; seatIndex?: number; message?: string } {
    this.lastActiveAt = Date.now();

    // Check if player already has a seat (reconnection)
    const existingIndex = this.findSeatByUserId(userId);
    if (existingIndex !== -1) {
      const existingSeat = this.seats[existingIndex]!;
      existingSeat.socketId = socketId;
      existingSeat.isConnected = true;
      existingSeat.nickname = nickname;
      existingSeat.lastActiveAt = Date.now();

      // Clear owner disconnect grace timer if owner reconnected
      if (existingSeat.userId === this.ownerUserId && this.ownerDisconnectTimer) {
        clearTimeout(this.ownerDisconnectTimer);
        this.ownerDisconnectTimer = null;
      }

      // If game is in progress, re-send private role to this player
      if (this.phase !== 'LOBBY' && existingSeat.role) {
        this.sendPrivateRoleCallback(socketId, existingSeat.role);
      }

      return { success: true, seatIndex: existingIndex };
    }

    // New player trying to join
    if (this.phase !== 'LOBBY') {
      return { success: false, message: 'Match is already in progress. New participants cannot join.' };
    }

    // Find first empty seat
    const firstEmpty = this.seats.findIndex((s) => s === null);
    if (firstEmpty === -1) {
      return { success: false, message: 'Room has reached maximum capacity.' };
    }

    const isOwner = userId === this.ownerUserId || this.getConnectedPlayersCount() === 0;
    if (isOwner) {
      this.ownerUserId = userId;
    }

    this.seats[firstEmpty] = {
      seatIndex: firstEmpty,
      userId,
      socketId,
      nickname,
      isOwner,
      isReady: false,
      isConnected: true,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      score: 0,
    };

    return { success: true, seatIndex: firstEmpty };
  }

  public removePlayer(socketId: string): void {
    const seatIndex = this.findSeatBySocketId(socketId);
    if (seatIndex === -1) return;

    const seat = this.seats[seatIndex]!;
    this.lastActiveAt = Date.now();

    if (this.phase === 'LOBBY') {
      // In lobby, free up seat completely
      const wasOwner = seat.userId === this.ownerUserId;
      this.seats[seatIndex] = null;

      if (wasOwner) {
        // Transfer ownership to first connected player
        const nextOwner = this.seats.find((s): s is PlayerSeat => s !== null && s.isConnected);
        if (nextOwner) {
          this.ownerUserId = nextOwner.userId;
          nextOwner.isOwner = true;
        }
      }
    } else {
      // In game, mark disconnected, keep seat and role for reconnection
      seat.isConnected = false;
      seat.lastActiveAt = Date.now();

      // If owner disconnected during game, start 60s grace timer
      if (seat.userId === this.ownerUserId && !this.ownerDisconnectTimer) {
        this.ownerDisconnectTimer = setTimeout(() => {
          this.handleOwnerGracePeriodExpired();
        }, 60000);
      }
    }
  }

  public transferOwnership(newOwnerUserId: string): boolean {
    const targetSeat = this.seats.find((s): s is PlayerSeat => s !== null && s.userId === newOwnerUserId);
    if (!targetSeat || !targetSeat.isConnected) return false;

    // Remove owner flag from old owner
    this.seats.forEach((s) => {
      if (s) s.isOwner = s.userId === newOwnerUserId;
    });
    this.ownerUserId = newOwnerUserId;
    return true;
  }

  private handleOwnerGracePeriodExpired(): void {
    this.ownerDisconnectTimer = null;
    const currentOwnerSeat = this.seats.find((s): s is PlayerSeat => s !== null && s.userId === this.ownerUserId);
    if (!currentOwnerSeat || currentOwnerSeat.isConnected) return;

    // Find longest-connected active player
    const connectedPlayers = this.seats
      .filter((s): s is PlayerSeat => s !== null && s.isConnected)
      .sort((a, b) => a.joinedAt - b.joinedAt);

    if (connectedPlayers.length > 0) {
      const newOwner = connectedPlayers[0];
      this.transferOwnership(newOwner.userId);
      this.addSystemMessage(`Ownership transferred to ${newOwner.nickname} due to inactivity.`);
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

    const occupiedSeats = this.seats.filter((s): s is PlayerSeat => s !== null && s.isConnected);
    const playerCount = occupiedSeats.length;

    // Get exact role set for playerCount and shuffle
    const roles = getRolesForPlayerCount(playerCount);
    const shuffledRoles = shuffleRoles(roles);

    // Assign roles to players securely
    occupiedSeats.forEach((seat, idx) => {
      seat.role = shuffledRoles[idx];
      seat.score = seat.role.points; // Base points
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

      // Send private role securely to this player
      this.sendPrivateRoleCallback(seat.socketId, seat.role);
    });

    // Total match limit: 300 seconds (5 minutes)
    this.matchDeadline = Date.now() + 300000;
    this.policePubliclyRevealed = false;
    this.accusationResult = undefined;

    // Transition to PRIVATE_REVEAL phase (10s)
    this.setPhase('PRIVATE_REVEAL', 10);
    this.addSystemMessage('The match has begun! Memorize your secret royal character.');

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

    // Phase-specific setup
    if (newPhase === 'POLICE_REVEAL') {
      // Reveal Police after 2.5 seconds
      this.policeRevealTimer = setTimeout(() => {
        this.policePubliclyRevealed = true;
        const policeSeat = this.seats[this.policeSeatIndex];
        const policeName = policeSeat ? policeSeat.nickname : 'Police';
        this.addSystemMessage(`👮 ${policeName} is the Police! Police, find the Thief!`);
        this.broadcastStateCallback(this.code);
      }, 2500);
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
        // Move to POLICE_REVEAL (5 seconds)
        this.setPhase('POLICE_REVEAL', 5);
        break;

      case 'POLICE_REVEAL': {
        this.policePubliclyRevealed = true;
        // Calculate discussion time: 300 - (10 + 5 + accusationDuration + 5 + 15) = 265 - accusationDuration
        const discussionDuration = 300 - (10 + 5 + accusationDuration + 5 + 15);
        this.setPhase('DISCUSSION', discussionDuration);
        this.addSystemMessage('Discussion phase: Interrogate suspects and read the room!');
        break;
      }

      case 'DISCUSSION':
        // Move to ACCUSATION
        this.setPhase('ACCUSATION', accusationDuration);
        this.addSystemMessage('Accusation phase! Police, tap your suspect and confirm your accusation!');
        break;

      case 'ACCUSATION':
        // Accusation timed out without Police picking
        this.resolveAccusation(-1, true);
        break;

      case 'EFFECT':
        // Move to THRONE (15 seconds)
        this.setPhase('THRONE', 15);
        const kingSeat = this.seats[this.kingSeatIndex];
        const kingName = kingSeat ? kingSeat.nickname : 'The King';
        this.addSystemMessage(`👑 All hail King ${kingName}! The King approaches the Royal Throne!`);
        break;

      case 'THRONE':
        // Move to persistent RESULTS
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

  public submitAccusation(policeUserId: string, targetSeatIndex: number): { success: boolean; message?: string } {
    if (this.phase !== 'ACCUSATION') {
      return { success: false, message: 'Accusations can only be made during the Accusation phase.' };
    }

    const policeSeat = this.seats[this.policeSeatIndex];
    if (!policeSeat || policeSeat.userId !== policeUserId) {
      return { success: false, message: 'Only the Police may make an accusation.' };
    }

    if (targetSeatIndex < 0 || targetSeatIndex >= this.seats.length || !this.seats[targetSeatIndex]) {
      return { success: false, message: 'Invalid target seat.' };
    }

    if (targetSeatIndex === this.policeSeatIndex) {
      return { success: false, message: 'Police cannot accuse themselves.' };
    }

    policeSeat.accusationTargetSeat = targetSeatIndex;
    this.resolveAccusation(targetSeatIndex, false);
    return { success: true };
  }

  private resolveAccusation(targetSeatIndex: number, isTimeout: boolean): void {
    const policeSeat = this.seats[this.policeSeatIndex];
    const thiefSeat = this.seats[this.thiefSeatIndex];
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

    // Calculate Police & Thief scores
    if (isCorrect) {
      if (policeSeat) policeSeat.score = 1000;
      if (thiefSeat) thiefSeat.score = 0;
    } else {
      if (policeSeat) policeSeat.score = 0;
      if (thiefSeat) thiefSeat.score = 1000;
    }

    // Advance immediately to EFFECT phase (5 seconds)
    this.setPhase('EFFECT', 5);

    // Send targeted visual effects to sockets
    this.seats.forEach((seat) => {
      if (!seat || !seat.isConnected) return;

      if (isCorrect) {
        // Correct guess: ONLY Thief gets gunshot + cracked screen
        if (seat.seatIndex === this.thiefSeatIndex) {
          this.sendTargetedEffectCallback(seat.socketId, 'gunshot');
        } else {
          this.sendTargetedEffectCallback(seat.socketId, 'neutral');
        }
      } else {
        // Wrong guess or timeout: ONLY Police gets grenade + cracked screen
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
      const kingSeat = this.seats[this.kingSeatIndex];
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
            nickname: s.nickname,
            roleId: s.role?.id ?? 0,
            roleName: s.role?.name ?? 'Unknown',
            score: s.score,
          })),
      });
      await matchDoc.save();

      // Update user stats
      for (const s of this.seats) {
        if (s && s.userId) {
          await User.findByIdAndUpdate(s.userId, {
            $inc: {
              gamesPlayed: 1,
              totalScore: s.score,
              wins: s.seatIndex === this.kingSeatIndex ? 1 : 0,
            },
          });
        }
      }
    } catch (err) {
      console.warn('[Room] Failed to save match history to MongoDB:', err);
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

    // Reset seats readiness and roles
    this.seats.forEach((seat) => {
      if (seat) {
        seat.isReady = false;
        seat.role = undefined;
        seat.score = 0;
        seat.accusationTargetSeat = undefined;
      }
    });

    this.addSystemMessage('Room reset! Mark ready when prepared for the next battle.');
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

    const cleanText = text.trim().slice(0, 150); // Length limit 150 chars
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
    const overallMatchTimeRemaining = this.phase === 'LOBBY' || this.phase === 'RESULTS'
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
      phaseTimeRemaining,
      phaseDuration: this.phaseDurationSeconds,
      overallMatchTimeRemaining,
      seats: publicSeats,
      policePlayerSeat: this.policePubliclyRevealed ? this.policeSeatIndex : undefined,
      kingPlayerSeat: allRolesRevealed ? this.kingSeatIndex : undefined,
      accusationResult: allRolesRevealed || this.phase === 'EFFECT' ? this.accusationResult : undefined,
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
