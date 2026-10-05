/**
 * Browser-safe localStorage / sessionStorage wrappers
 * Safe during SSR and prerendering.
 */

const KEYS = {
  NICKNAME: 'raja_rani_nickname',
  SESSION_TOKEN: 'raja_rani_session_token',
  LANGUAGE: 'raja_rani_lang',
  MUTED: 'raja_rani_muted',
  REDUCED_MOTION: 'raja_rani_reduced_motion',
} as const;

export const clientStorage = {
  getNickname(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(KEYS.NICKNAME) || '';
    } catch {
      return '';
    }
  },

  setNickname(nickname: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.NICKNAME, nickname.trim());
    } catch {}
  },

  getSessionToken(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(KEYS.SESSION_TOKEN) || sessionStorage.getItem(KEYS.SESSION_TOKEN) || '';
    } catch {
      return '';
    }
  },

  setSessionToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.SESSION_TOKEN, token);
      sessionStorage.setItem(KEYS.SESSION_TOKEN, token);
    } catch {}
  },

  getLanguage(): 'en' | 'ta' {
    if (typeof window === 'undefined') return 'en';
    try {
      const val = localStorage.getItem(KEYS.LANGUAGE);
      return val === 'ta' ? 'ta' : 'en';
    } catch {
      return 'en';
    }
  },

  setLanguage(lang: 'en' | 'ta'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.LANGUAGE, lang);
    } catch {}
  },

  getIsMuted(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(KEYS.MUTED) === 'true';
    } catch {
      return false;
    }
  },

  setIsMuted(isMuted: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.MUTED, isMuted ? 'true' : 'false');
    } catch {}
  },

  getReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(KEYS.REDUCED_MOTION) === 'true';
    } catch {
      return false;
    }
  },

  setReducedMotion(reduced: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.REDUCED_MOTION, reduced ? 'true' : 'false');
    } catch {}
  },
};
