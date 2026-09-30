import { Room } from './Room.js';
import { RoleDefinition } from './roleDefinitions.js';

export class GameManager {
  private rooms: Map<string, Room> = new Map();
  private broadcastCallback: (roomCode: string) => void;
  private sendPrivateRoleCallback: (socketId: string, role: RoleDefinition) => void;
  private sendTargetedEffectCallback: (socketId: string, effectType: 'gunshot' | 'grenade' | 'neutral') => void;

  constructor(callbacks: {
    broadcastState: (roomCode: string) => void;
    sendPrivateRole: (socketId: string, role: RoleDefinition) => void;
    sendTargetedEffect: (socketId: string, effectType: 'gunshot' | 'grenade' | 'neutral') => void;
  }) {
    this.broadcastCallback = callbacks.broadcastState;
    this.sendPrivateRoleCallback = callbacks.sendPrivateRole;
    this.sendTargetedEffectCallback = callbacks.sendTargetedEffect;

    // Periodic cleanup of stale rooms (inactive for > 2 hours)
    setInterval(() => {
      this.cleanupStaleRooms();
    }, 15 * 60 * 1000);
  }

  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  public createRoom(ownerUserId: string, maxCapacity: number = 10, chatEnabled: boolean = true): Room {
    const code = this.generateRoomCode();
    const room = new Room(code, ownerUserId, maxCapacity, chatEnabled, {
      broadcastState: this.broadcastCallback,
      sendPrivateRole: this.sendPrivateRoleCallback,
      sendTargetedEffect: this.sendTargetedEffectCallback,
    });
    this.rooms.set(code, room);
    console.log(`[GameManager] Created room ${code} (Capacity: ${room.maxCapacity}) for owner ${ownerUserId}`);
    return room;
  }

  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase().trim());
  }

  public removeRoom(code: string): void {
    const room = this.rooms.get(code);
    if (room) {
      room.destroy();
      this.rooms.delete(code);
      console.log(`[GameManager] Deleted room ${code}`);
    }
  }

  public findRoomBySocketId(socketId: string): { room: Room; seatIndex: number } | null {
    for (const room of this.rooms.values()) {
      const seatIndex = room.findSeatBySocketId(socketId);
      if (seatIndex !== -1) {
        return { room, seatIndex };
      }
    }
    return null;
  }

  private cleanupStaleRooms(): void {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [code, room] of this.rooms.entries()) {
      if (room.lastActiveAt < twoHoursAgo && room.getConnectedPlayersCount() === 0) {
        room.destroy();
        this.rooms.delete(code);
        console.log(`[GameManager] Cleaned up stale room ${code}`);
      }
    }
  }
}
