import test from 'node:test';
import assert from 'node:assert/strict';
import { Room } from '../src/server/game/Room';
import { GameManager } from '../src/server/game/GameManager';

test('Multiplayer: Reconnection restores the same seat and role', () => {
  const privateRoles: any[] = [];
  const room = new Room('RECON1', 'owner_1', 6, true, {
    broadcastState: () => {},
    sendPrivateRole: (sockId, role) => privateRoles.push({ sockId, role }),
    sendTargetedEffect: () => {},
  });

  // Player joins with token_1
  const join1 = room.addPlayer('owner_1', 'sock_initial', 'Prince Vikram', 'token_secret_123');
  assert.ok(join1.success);
  const originalSeatIndex = join1.seatIndex;

  // Add 4 more players
  for (let i = 2; i <= 5; i++) {
    room.addPlayer(`user_${i}`, `sock_${i}`, `Player ${i}`, `token_${i}`);
    room.toggleReady(`user_${i}`);
  }
  room.toggleReady('owner_1');
  const start = room.startMatch('owner_1');
  assert.equal(start.success, true);

  const assignedRole = room.seats[originalSeatIndex!]?.role;
  assert.ok(assignedRole, 'Role must be assigned to player 1');

  // Simulate player 1 disconnecting
  room.removePlayer('sock_initial');
  assert.equal(room.seats[originalSeatIndex!]?.isConnected, false, 'Seat marked disconnected');

  // Player 1 reconnects with a new socket ID but the same session token
  const recon = room.addPlayer('user_1', 'sock_new_reconnect', 'Prince Vikram', 'token_secret_123');
  assert.ok(recon.success);
  assert.equal(recon.seatIndex, originalSeatIndex, 'Restored to exact same seat');

  const restoredSeat = room.seats[originalSeatIndex!]!;
  assert.equal(restoredSeat.isConnected, true);
  assert.equal(restoredSeat.socketId, 'sock_new_reconnect');
  assert.equal(restoredSeat.role?.id, assignedRole?.id, 'Secret role preserved across reconnection');

  room.destroy();
});

test('Multiplayer: Permission validation & owner transfer', () => {
  const room = new Room('PERM01', 'owner_1', 10, true, {
    broadcastState: () => {},
    sendPrivateRole: () => {},
    sendTargetedEffect: () => {},
  });

  room.addPlayer('owner_1', 'sock_1', 'King Arthur', 'token_1');
  room.addPlayer('user_2', 'sock_2', 'Queen Guinevere', 'token_2');

  // Non-owner cannot start match
  const invalidStart = room.startMatch('user_2');
  assert.equal(invalidStart.success, false);
  assert.match(invalidStart.message || '', /owner/i);

  // Owner leaves during lobby -> ownership transfers to next player
  room.removePlayer('sock_1');
  assert.equal(room.ownerUserId, 'user_2', 'Ownership transferred to user_2');
  assert.equal(room.seats[1]?.isOwner, true);

  room.destroy();
});

test('Multiplayer: Chat rate limiting and character limits', () => {
  const room = new Room('CHAT01', 'owner_1', 10, true, {
    broadcastState: () => {},
    sendPrivateRole: () => {},
    sendTargetedEffect: () => {},
  });

  room.addPlayer('user_1', 'sock_1', 'Knight', 'token_1');

  // Valid message
  const msg1 = room.addChatMessage('user_1', 'For the Kingdom!');
  assert.equal(msg1.success, true);
  assert.equal(room.chatMessages.length, 1);
  assert.equal(room.chatMessages[0].text, 'For the Kingdom!');

  // Message over 150 chars is truncated
  const longText = 'A'.repeat(200);
  const msg2 = room.addChatMessage('user_1', longText);
  assert.equal(msg2.success, true);
  assert.equal(room.chatMessages[1].text.length, 150, 'Truncated to 150 characters');

  // Non-seated player cannot chat
  const msg3 = room.addChatMessage('ghost_user', 'Hello?');
  assert.equal(msg3.success, false);

  room.destroy();
});

test('Multiplayer: Rematch resets match state while preserving players', () => {
  const room = new Room('REMATCH', 'owner_1', 5, true, {
    broadcastState: () => {},
    sendPrivateRole: () => {},
    sendTargetedEffect: () => {},
  });

  room.addPlayer('owner_1', 'sock_1', 'Player 1', 'token_1');
  room.toggleReady('owner_1');
  for (let i = 2; i <= 5; i++) {
    room.addPlayer(`user_${i}`, `sock_${i}`, `Player ${i}`, `token_${i}`);
    room.toggleReady(`user_${i}`);
  }

  room.startMatch('owner_1');
  assert.equal(room.phase, 'PRIVATE_REVEAL');

  // Only owner can trigger rematch
  const invalidRematch = room.resetForRematch('user_2');
  assert.equal(invalidRematch.success, false);

  const rematch = room.resetForRematch('owner_1');
  assert.equal(rematch.success, true);
  assert.equal(room.phase, 'LOBBY');

  // All 5 players are still seated, readiness reset to false
  const seatedCount = room.getConnectedPlayersCount();
  assert.equal(seatedCount, 5);
  for (const s of room.seats) {
    if (s) {
      assert.equal(s.isReady, false);
      assert.equal(s.role, undefined);
    }
  }

  room.destroy();
});
