import { UserProfile } from '../types/game';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';
const DEFAULT_TIMEOUT_MS = 6000;

export interface DbStatusResponse {
  isDbConnected: boolean;
  message: string;
  setupGuide: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be busy or offline.');
    }
    throw new Error('Network error: Unable to reach the game server.');
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseJsonResponse(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: `Server returned non-JSON response (HTTP ${res.status}): ${text.slice(0, 120)}` };
  }
}

export const api = {
  async getDbStatus(): Promise<DbStatusResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/status`, {}, 4000);
      const data = await parseJsonResponse(res);
      if (res.ok) return data;
      return {
        isDbConnected: false,
        message: data.error || 'Database unavailable',
        setupGuide: data.setupGuide || 'Ensure MongoDB is running.',
      };
    } catch (err: any) {
      return {
        isDbConnected: false,
        message: err.message || 'Could not reach backend API server.',
        setupGuide: 'Ensure the backend Express server is running on port 5000.',
      };
    }
  },

  async signup(data: { nickname: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result.error || result.message || 'Registration failed');
    }
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result.error || result.message || 'Login failed');
    }
    return result;
  },

  async getMe(token: string): Promise<{ user: UserProfile }> {
    const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Distinguish 401/403 (invalid/expired session) from 500/503/network
    if (res.status === 401 || res.status === 403) {
      const authErr = new Error('Session expired. Please log in again.');
      (authErr as any).isAuthError = true;
      throw authErr;
    }

    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result.error || 'Failed to verify user profile');
    }
    return result;
  },
};
