> **Repaired startup:** See `START-HERE.txt`. On Windows, extract the ZIP and run `START-GAME.cmd`. Alternatively run `npm ci` then `npm start` and open the printed URL. Do not open source `index.html` directly. `npm start` rebuilds both sides; `npm run preview` now starts the complete application rather than a frontend-only preview.

# 🤴 Raja Rani (King & Queen) - Royal Multiplayer Game 👸

A responsive, real-time multiplayer deduction game for **5 to 30 players**, inspired by the classic Indian royal game "Raja Rani". Built with **React, Vite, TypeScript, Tailwind CSS, Node.js, Express, Socket.IO, and MongoDB**.

---

## 🏰 Game Overview & Rules

1. **Capacity & Roles (5 to 30 Players)**:
   - **5-Player Classic Base**:
     - **King (ராஜா)**: 10,000 points (*Royal Winner with highest fixed score*)
     - **Queen (ராணி)**: 9,000 points
     - **Minister (மந்திரி)**: 8,500 points
     - **Police (போலீஸ்)**: 1,000 points if successful, 0 if wrong
     - **Thief (திருடன்)**: 0 points if caught, 1,000 points if escapes
   - **6 to 30 Roles**: Soldier (8,000), Spy (7,800), Prince (7,600), Princess (7,400), Commander (7,200), Royal Advisor (7,000), Treasurer (6,800), Judge (6,600), Ambassador (6,400), Royal Scholar (6,200), Royal Physician (6,000), Architect (5,800), Engineer (5,600), Knight (5,400), Archer (5,200), Scout (5,000), Messenger (4,800), Merchant (4,600), Blacksmith (4,400), Royal Chef (4,200), Musician (4,000), Poet (3,800), Artist (3,600), Gardener (3,400), Court Jester (3,200).

2. **Match State Machine & 5-Minute Maximum (up to 300s)**:
   - `LOBBY`: Room code generation, seating chairs, ready statuses, room-scoped chat.
   - `PRIVATE_REVEAL` (10s): Secret character card flip for each player.
   - `POLICE_REVEAL` (5s): Public identification of Police player after 2.5s ("Police, find the Thief!"). King is **not** revealed.
   - `DISCUSSION`: Interrogate suspects and read the room.
   - `ACCUSATION` (30s for 5-10p, 35s for 11-20p, 40s for 21-30p): Police taps a suspect's chair and confirms accusation.
   - `EFFECT` (5s):
     - **Correct Guess**: Police +1,000, Thief 0. *ONLY Thief's screen triggers gunshot & cracked screen overlay.*
     - **Wrong Guess / Timeout**: Police 0, Thief +1,000. *ONLY Police's screen triggers grenade blast & cracked screen overlay.*
     - Other players see neutral "Accusation resolved" banner.
   - `THRONE` (15s): King is revealed and animated walking to the throne and sitting down with coronation fanfare.
   - `RESULTS`: Full court scoreboard with all nicknames, characters, points, and Play Again / Rematch reset.

---

## 🎨 Design Palette

- **Beige Background**: `#F5EBDD`
- **Cream Panels**: `#FFF8EF`
- **Coral Reef Accents**: `#FF7F6A`
- **Deep Coral Buttons**: `#B94738`
- **Dark Brown Text**: `#352820`
- **Sand Borders**: `#D8C3A5`
- **Gold Details**: `#B58A42`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Optional for guest testing, required for persistent accounts & match history)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/raja_rani
JWT_SECRET=raja_rani_royal_secret_token_key_change_in_production
CLIENT_URL=http://localhost:5173
```

### 4. Running the Development Server
Run both client and server concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API & Socket: `http://localhost:5000`

### 5. Production Build & Serving
Build both client and server, then run Express to serve everything from a single origin:
```bash
npm run build
npm start
```

---

## 🛡️ Security & Privacy Guarantees
- Roles are shuffled randomly and stored strictly on the server.
- Secret roles are never broadcast in public payloads until the match concludes.
- Accusation inputs and scores are validated on the server.
- Client reconnection preserves existing seat, role, and server deadlines.
- Web Audio API synthesizers provide 100% offline audio with zero third-party dependencies.
