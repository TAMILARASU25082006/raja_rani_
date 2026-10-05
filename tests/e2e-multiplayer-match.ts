import { io, Socket } from 'socket.io-client';
import assert from 'node:assert/strict';

const SERVER_URL = 'http://localhost:5000';

async function runMultiplayerSimulation() {
  console.log('🚀 Connecting 5 independent players to', SERVER_URL);

  const players: { name: string; socket: Socket; role?: any; seatIndex?: number }[] = [
    { name: 'Arjun', socket: io(SERVER_URL, { path: '/socket.io' }) },
    { name: 'Meera', socket: io(SERVER_URL, { path: '/socket.io' }) },
    { name: 'Vikram', socket: io(SERVER_URL, { path: '/socket.io' }) },
    { name: 'Devi', socket: io(SERVER_URL, { path: '/socket.io' }) },
    { name: 'Karan', socket: io(SERVER_URL, { path: '/socket.io' }) },
  ];

  // Wait for all connections
  await Promise.all(
    players.map(
      (p) =>
        new Promise<void>((resolve) => {
          p.socket.on('connect', () => {
            p.socket.emit('authenticate', { nickname: p.name });
            resolve();
          });
        })
    )
  );
  console.log('✅ All 5 sockets connected and authenticated');

  // Player 1 creates room
  let roomCode = '';
  await new Promise<void>((resolve) => {
    players[0].socket.emit('create_room', { maxCapacity: 5, nickname: players[0].name });
    players[0].socket.on('room_created', (data: { roomCode: string }) => {
      roomCode = data.roomCode;
      resolve();
    });
  });
  console.log(`🏰 Room created with code: ${roomCode}`);
  assert.equal(roomCode.length, 6, 'Room code must be 6 characters');

  // Players 2-5 join room
  for (let i = 1; i < 5; i++) {
    await new Promise<void>((resolve) => {
      players[i].socket.emit('join_room', { roomCode, nickname: players[i].name });
      players[i].socket.on('room_joined', (data: { seatIndex: number }) => {
        players[i].seatIndex = data.seatIndex;
        resolve();
      });
    });
  }
  console.log('✅ Players 2-5 joined room');

  // Register private role listeners
  const rolePromises = players.map(
    (p) =>
      new Promise<void>((resolve) => {
        p.socket.on('private_role_assigned', (role: any) => {
          p.role = role;
          resolve();
        });
      })
  );

  // All mark ready
  players.forEach((p) => p.socket.emit('toggle_ready'));
  console.log('✅ All 5 players marked ready');

  // Wait 300ms for state to settle
  await new Promise((r) => setTimeout(r, 300));

  // Owner starts match
  console.log('👑 Owner starting match...');
  players[0].socket.emit('start_match');

  // Wait for private role assignments
  await Promise.all(rolePromises);
  console.log('✅ All 5 players received private roles:');
  players.forEach((p) => console.log(`   - ${p.name}: ${p.role.name} (${p.role.points} pts)`));

  // Verify roles
  const assignedNames = players.map((p) => p.role.name).sort();
  assert.deepEqual(
    assignedNames,
    ['King', 'Minister', 'Police', 'Queen', 'Thief'],
    'Must have King, Queen, Minister, Police, Thief'
  );

  // Disconnect all sockets cleanly
  players.forEach((p) => p.socket.disconnect());
  console.log('🎉 5-Player multiplayer simulation completed successfully!');
  process.exit(0);
}

runMultiplayerSimulation().catch((err) => {
  console.error('Simulation error:', err);
  process.exit(1);
});
