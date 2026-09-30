if (window.location.protocol !== 'file:') {
  import('./renderApp').catch((error: unknown) => {
    console.error('[Startup] Unable to load game modules:', error);
    const message = document.getElementById('boot-message');
    const help = document.getElementById('boot-help');
    if (message) message.textContent = 'Unable to load the game.';
    if (help) help.textContent = 'Run npm start from the project folder and open its printed URL. Check the browser console for the loading error.';
  });
}
export {};
