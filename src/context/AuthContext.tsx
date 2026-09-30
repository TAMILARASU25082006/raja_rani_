import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/game';
import { api, DbStatusResponse } from '../services/api';

// Safe localStorage access helpers
const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  guestId: string | null;
  isLoading: boolean;
  dbStatus: DbStatusResponse | null;
  pendingInviteCode: string | null;
  setPendingInviteCode: (code: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (nickname: string, email: string, password: string) => Promise<void>;
  playAsGuest: (nickname: string) => void;
  syncServerIdentity: (userId: string, nickname: string) => void;
  logout: () => void;
  refreshDbStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => safeStorage.get('raja_rani_token'));
  const [guestId, setGuestId] = useState<string | null>(() => safeStorage.get('raja_rani_guest_id'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);

  // Preserve invite code from URL query parameters (e.g. ?join=CODE)
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('join');
      return code ? code.toUpperCase().trim() : null;
    } catch {
      return null;
    }
  });

  const refreshDbStatus = useCallback(async () => {
    try {
      const status = await api.getDbStatus();
      setDbStatus(status);
    } catch {
      setDbStatus({
        isDbConnected: false,
        message: 'Could not reach server database',
        setupGuide: 'Make sure the backend is active on port 5000.',
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        await refreshDbStatus();
        const savedToken = safeStorage.get('raja_rani_token');
        if (savedToken) {
          try {
            const data = await api.getMe(savedToken);
            if (isMounted) {
              setUser(data.user);
              setToken(savedToken);
            }
          } catch (err: any) {
            // Only clear token if server explicitly rejected auth (401/403)
            if (err?.isAuthError) {
              safeStorage.remove('raja_rani_token');
              if (isMounted) {
                setToken(null);
                setUser(null);
              }
            } else {
              // Network hiccup - retain guest/offline fallback representation with saved token
              console.warn('[Auth] Transient network issue during session restore:', err.message);
            }
          }
        } else {
          const savedGuestNick = safeStorage.get('raja_rani_guest_nick');
          const savedGuestId = safeStorage.get('raja_rani_guest_id');
          if (savedGuestNick && isMounted) {
            setUser({
              id: savedGuestId || 'guest_' + Math.random().toString(36).substring(2, 10),
              nickname: savedGuestNick,
              email: '',
              gamesPlayed: 0,
              totalScore: 0,
              wins: 0,
            });
          }
        }
      } catch (e) {
        console.error('[Auth] Error during initialization:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [refreshDbStatus]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    safeStorage.set('raja_rani_token', data.token);
    safeStorage.remove('raja_rani_guest_nick');
    safeStorage.remove('raja_rani_guest_id');
    setToken(data.token);
    setGuestId(null);
    setUser(data.user);
  };

  const signup = async (nickname: string, email: string, password: string) => {
    const data = await api.signup({ nickname, email, password });
    safeStorage.set('raja_rani_token', data.token);
    safeStorage.remove('raja_rani_guest_nick');
    safeStorage.remove('raja_rani_guest_id');
    setToken(data.token);
    setGuestId(null);
    setUser(data.user);
  };

  const playAsGuest = (nickname: string) => {
    const cleanNick = nickname.trim() || 'Royal Player';
    let gId = safeStorage.get('raja_rani_guest_id');
    if (!gId) {
      gId = 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);
      safeStorage.set('raja_rani_guest_id', gId);
    }
    safeStorage.set('raja_rani_guest_nick', cleanNick);
    setGuestId(gId);
    setUser({
      id: gId,
      nickname: cleanNick,
      email: '',
      gamesPlayed: 0,
      totalScore: 0,
      wins: 0,
    });
  };

  const syncServerIdentity = useCallback((userId: string, nickname: string) => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: userId,
          nickname,
          email: '',
          gamesPlayed: 0,
          totalScore: 0,
          wins: 0,
        };
      }
      if (prev.id !== userId || prev.nickname !== nickname) {
        return { ...prev, id: userId, nickname };
      }
      return prev;
    });

    if (userId.startsWith('guest_')) {
      safeStorage.set('raja_rani_guest_id', userId);
      safeStorage.set('raja_rani_guest_nick', nickname);
      setGuestId(userId);
    }
  }, []);

  const logout = () => {
    safeStorage.remove('raja_rani_token');
    safeStorage.remove('raja_rani_guest_nick');
    safeStorage.remove('raja_rani_guest_id');
    setToken(null);
    setGuestId(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        guestId,
        isLoading,
        dbStatus,
        pendingInviteCode,
        setPendingInviteCode,
        login,
        signup,
        playAsGuest,
        syncServerIdentity,
        logout,
        refreshDbStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
