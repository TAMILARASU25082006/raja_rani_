import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_ROLES,
  getRolesForPlayerCount,
  shuffleRoles,
} from '../src/server/game/roleDefinitions';
import { Room } from '../src/server/game/Room';

test('Game Rules: Role scaling from 3 to 30 players', () => {
  // Test 3 players roles: King, Police, Thief
  const roles3 = getRolesForPlayerCount(3);
  assert.equal(roles3.length, 3);
  assert.deepEqual(roles3.map((r) => r.name), ['King', 'Police', 'Thief']);

  // Test 4 players roles: King, Queen, Police, Thief
  const roles4 = getRolesForPlayerCount(4);
  assert.equal(roles4.length, 4);
  assert.deepEqual(roles4.map((r) => r.name), ['King', 'Queen', 'Police', 'Thief']);

  // Test 5 players classic roles
  const roles5 = getRolesForPlayerCount(5);
  assert.equal(roles5.length, 5);
  const names5 = roles5.map((r) => r.name);
  assert.deepEqual(names5, ['King', 'Queen', 'Minister', 'Police', 'Thief']);

  // Check baseline points
  assert.equal(roles5[0].points, 10000, 'King must have 10,000 pts');
  assert.equal(roles5[1].points, 9000, 'Queen must have 9,000 pts');
  assert.equal(roles5[2].points, 8500, 'Minister must have 8,500 pts');
  assert.equal(roles5[3].points, 1000, 'Police has base 1,000 pts');
  assert.equal(roles5[4].points, 0, 'Thief has base 0 pts');

  // Test scaling to 10 players
  const roles10 = getRolesForPlayerCount(10);
  assert.equal(roles10.length, 10);
  assert.ok(roles10.some((r) => r.name === 'Commander'));

  // Test maximum 30 players
  const roles30 = getRolesForPlayerCount(30);
  assert.equal(roles30.length, 30);
  assert.ok(roles30.some((r) => r.name === 'Court Jester'));
  assert.equal(roles30[29].name, 'Court Jester');
  assert.equal(roles30[29].points, 3200);

  // Test bounds clamping
  const rolesUnder = getRolesForPlayerCount(2);
  assert.equal(rolesUnder.length, 3, 'Clamped to minimum 3');
  const rolesOver = getRolesForPlayerCount(50);
  assert.equal(rolesOver.length, 30, 'Clamped to maximum 30');
});

test('Game Rules: Fisher-Yates shuffle preserves all elements', () => {
  const roles = getRolesForPlayerCount(10);
  const shuffled = shuffleRoles(roles);
  assert.equal(shuffled.length, 10);

  const originalIds = roles.map((r) => r.id).sort((a, b) => a - b);
  const shuffledIds = shuffled.map((r) => r.id).sort((a, b) => a - b);
  assert.deepEqual(shuffledIds, originalIds, 'All original roles must remain present after shuffle');
});

test('Game Rules: Authoritative scoring on correct accusation', () => {
  const sentPrivateRoles: any[] = [];
  const sentEffects: any[] = [];

  const room = new Room('TEST01', 'owner_1', 5, true, {
    broadcastState: () => {},
    sendPrivateRole: (sockId, role) => sentPrivateRoles.push({ sockId, role }),
    sendTargetedEffect: (sockId, effect) => sentEffects.push({ sockId, effect }),
  });

  // Seat 5 players
  room.addPlayer('owner_1', 'sock_1', 'Player 1', 'token_1');
  room.toggleReady('owner_1');
  for (let i = 2; i <= 5; i++) {
    const res = room.addPlayer(`user_${i}`, `sock_${i}`, `Player ${i}`, `token_${i}`);
    assert.ok(res.success);
    room.toggleReady(`user_${i}`);
  }

  assert.equal(room.canStartMatch(), true, 'All 5 players ready, match can start');

  const startRes = room.startMatch('owner_1');
  assert.equal(startRes.success, true);
  assert.equal(room.phase, 'PRIVATE_REVEAL');
  assert.equal(sentPrivateRoles.length, 5, 'Each player received private role');

  // Verify Police and Thief indices are set
  assert.notEqual(room.policeSeatIndex, -1);
  assert.notEqual(room.thiefSeatIndex, -1);
  assert.notEqual(room.kingSeatIndex, -1);

  // Manually fast-forward to ACCUSATION phase for test
  (room as any).setPhase('ACCUSATION', 30);

  const policeSeat = room.seats[room.policeSeatIndex]!;
  const thiefSeat = room.seats[room.thiefSeatIndex]!;

  // Police makes CORRECT accusation
  const accRes = room.submitAccusation(policeSeat.userId, thiefSeat.seatIndex);
  assert.equal(accRes.success, true);
  assert.equal(room.phase, 'EFFECT');

  // Verify points
  assert.equal(policeSeat.score, 1000, 'Police gets 1,000 pts for correct accusation');
  assert.equal(thiefSeat.score, 0, 'Thief gets 0 pts when caught');

  // Verify targeted effect: ONLY Thief received gunshot
  const thiefEffect = sentEffects.find((e) => e.sockId === thiefSeat.socketId);
  const policeEffect = sentEffects.find((e) => e.sockId === policeSeat.socketId);
  assert.equal(thiefEffect?.effect, 'gunshot', 'Thief received gunshot effect');
  assert.equal(policeEffect?.effect, 'neutral', 'Police received neutral effect');

  room.destroy();
});

test('Game Rules: Authoritative scoring on wrong accusation or timeout', () => {
  const sentEffects: any[] = [];
  const room = new Room('TEST02', 'owner_1', 5, true, {
    broadcastState: () => {},
    sendPrivateRole: () => {},
    sendTargetedEffect: (sockId, effect) => sentEffects.push({ sockId, effect }),
  });

  room.addPlayer('owner_1', 'sock_1', 'Player 1', 'token_1');
  room.toggleReady('owner_1');
  for (let i = 2; i <= 5; i++) {
    room.addPlayer(`user_${i}`, `sock_${i}`, `Player ${i}`, `token_${i}`);
    room.toggleReady(`user_${i}`);
  }

  room.startMatch('owner_1');
  (room as any).setPhase('ACCUSATION', 30);

  const policeSeat = room.seats[room.policeSeatIndex]!;
  const thiefSeat = room.seats[room.thiefSeatIndex]!;

  // Find a bystander seat (not thief, not police)
  const innocentSeatIndex = room.seats.findIndex(
    (s) => s && s.seatIndex !== room.policeSeatIndex && s.seatIndex !== room.thiefSeatIndex
  );
  assert.notEqual(innocentSeatIndex, -1);

  // Police makes WRONG accusation
  const accRes = room.submitAccusation(policeSeat.userId, innocentSeatIndex);
  assert.equal(accRes.success, true);
  assert.equal(room.phase, 'EFFECT');

  // Verify points
  assert.equal(policeSeat.score, 0, 'Police gets 0 pts on wrong accusation');
  assert.equal(thiefSeat.score, 1000, 'Thief gets 1,000 pts when police fails');

  // Verify targeted effect: ONLY Police received grenade
  const policeEffect = sentEffects.find((e) => e.sockId === policeSeat.socketId);
  const thiefEffect = sentEffects.find((e) => e.sockId === thiefSeat.socketId);
  assert.equal(policeEffect?.effect, 'grenade', 'Police received grenade effect on wrong accusation');
  assert.equal(thiefEffect?.effect, 'neutral', 'Thief received neutral effect');

  room.destroy();
});

test('Game Rules: 3-player match lifecycle (King, Police, Thief)', () => {
  const sentPrivateRoles: any[] = [];
  const sentEffects: any[] = [];

  const room = new Room('TRIO01', 'owner_1', 3, true, {
    broadcastState: () => {},
    sendPrivateRole: (sockId, role) => sentPrivateRoles.push({ sockId, role }),
    sendTargetedEffect: (sockId, effect) => sentEffects.push({ sockId, effect }),
  });

  // Seat 3 players
  room.addPlayer('owner_1', 'sock_1', 'Player 1', 'token_1');
  room.toggleReady('owner_1');
  room.addPlayer('user_2', 'sock_2', 'Player 2', 'token_2');
  room.toggleReady('user_2');
  room.addPlayer('user_3', 'sock_3', 'Player 3', 'token_3');
  room.toggleReady('user_3');

  assert.equal(room.canStartMatch(), true, 'All 3 players ready, match can start');

  const startRes = room.startMatch('owner_1');
  assert.equal(startRes.success, true);
  assert.equal(room.phase, 'PRIVATE_REVEAL');
  assert.equal(sentPrivateRoles.length, 3);

  // Exactly King, Police, Thief assigned
  const roleNames = sentPrivateRoles.map((r) => r.role.name).sort();
  assert.deepEqual(roleNames, ['King', 'Police', 'Thief']);

  // Move to ACCUSATION
  (room as any).setPhase('ACCUSATION', 30);
  const policeSeat = room.seats[room.policeSeatIndex]!;
  const thiefSeat = room.seats[room.thiefSeatIndex]!;

  const accRes = room.submitAccusation(policeSeat.userId, thiefSeat.seatIndex);
  assert.equal(accRes.success, true);
  assert.equal(room.phase, 'EFFECT');
  assert.equal(policeSeat.score, 1000);
  assert.equal(thiefSeat.score, 0);

  room.destroy();
});
