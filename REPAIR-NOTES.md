# Startup repair and verification

The uploaded version passed its production build. In a correctly served browser
session its login screen rendered; the exact white screen on the owner's device
was not reproduced. The source HTML previously contained an empty React root,
so direct file opening or an entry-module failure could leave a blank screen.

Changes:
- Visible, CSS-independent startup screen and direct-file instructions.
- Error handling for failed entry modules and startup timeout.
- Guarded storage access in language and sound providers.
- One-command full application startup that rebuilds frontend and backend.
- Windows launcher that installs dependencies and opens the URL after health check.
- Preview now runs the complete application, including its API and sockets.
- Node's watch mode replaces the tsx CLI watch launcher.
- Website starts listening without waiting for MongoDB connection attempts.
- Clear port-in-use errors; database URI is no longer printed on connection success.
- Fixed invalid React SVG attributes and explicit local development proxy address.

Verified:
- TypeScript client/server compilation and Vite production build passed.
- Production login rendered in Chromium.
- A guest created a room and a second isolated browser session joined by invitation.
- Direct file opening displayed startup instructions.
- Blocking JavaScript assets displayed an error rather than a blank screen.
- Denying localStorage access still allowed login rendering.
- Normal production browser flow produced no uncaught page exceptions.
- Development login rendered at mobile width 390px; proxied API health returned 200.

Limitations:
- No MongoDB service was configured during verification; database-backed signup and
  account login were not tested. Existing guest mode was used.
- Windows .cmd launcher was written for Windows but tested indirectly via its
  npm build and Node startup operations on Linux, not run on Windows.
- A complete five-minute match, public deployment and real-phone network access
  were outside this startup repair's verification.
