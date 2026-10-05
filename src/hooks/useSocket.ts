'use client';

import { useGame } from '../providers/GameProvider';
import { getSocket } from '../lib/client/socket';

export function useSocket() {
  const { isSocketConnected, isSocketAuthenticated } = useGame();
  const socket = getSocket();

  return {
    socket,
    isConnected: isSocketConnected,
    isAuthenticated: isSocketAuthenticated,
  };
}
