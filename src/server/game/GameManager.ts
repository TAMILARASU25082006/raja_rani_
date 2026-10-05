import { Room } from './Room';
import { RoleDefinition } from './roleDefinitions';
import { TargetedEffectType } from '../../types/game';

export class GameManager {
  private rooms: Map<string, Room> = new Map();
  private callbacks: {
    broadcastState: (roomCode: string) => void;
    sendPrivateRole: (socketId: string, role: RoleDefinition) => void;
    sendTargetedEffect: (socketId: string, effectType: TargetedEffectType) => void;
  };

  constructor(callbacks: {
    broadcastState: (roomCode: string) => void;
    sendPrivateRole: (socketId: string, role: RoleDefinition) => void;
    sendTargetedEffect: (socketId: string, effectType: TargetedEffectType) => void;
  }) {
    this.callbacks = callbacks;

    // Periodic sweep for rooms inactive for over 2 hours
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
    const room = new Room(code, ownerUserId, maxCapacity, chatEnabled, this.callbacks);
    this.rooms.set(code, room);
    return room;
  }

  public getRoom(roomCode: string): Room | undefined {
    if (!roomCode) return undefined;
    return this.rooms.get(roomCode.toUpperCase().trim());
  }

  public removeRoom(roomCode: string): boolean {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);
    if (room) {
      room.destroy();
      return this.rooms.delete(code);
    }
    return false;
  }

  public cleanupStaleRooms(): void {
    const now = Date.now();
    const maxInactive = 2 * 60 * 60 * 1000; // 2 hours
    for (const [code, room] of this.rooms.entries()) {
      if (now - room.lastActiveAt > maxInactive) {
        room.destroy();
        this.rooms.delete(code);
      }
    }
  }

  public getAllRoomsCount(): number {
    return this.rooms.size;
  }
}
