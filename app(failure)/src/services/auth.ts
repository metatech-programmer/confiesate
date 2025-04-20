import { jwtDecode } from 'jwt-decode';
import { api } from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthTokens {
  token: string;
  refreshToken: string;
}

interface DecodedToken {
  exp: number;
  role: string;
  uuid: string;
}

class AuthService {
  private refreshTokenTimeout?: NodeJS.Timeout;
  private readonly persistConfig = { key: 'auth_persist', version: 1 };

  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    this.setTokens({ token, refreshToken });
    return { user, token };
  }

  async register(data: { email: string; password: string; name: string }) {
    const response = await api.post('/auth/register', data);
    const { token, refreshToken, user } = response.data;
    this.setTokens({ token, refreshToken });
    return { user, token };
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearTokens();
      window.location.href = '/';
    }
  }

  async verifySession() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  initialize() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (Date.now() >= decoded.exp * 1000) {
          return this.refreshToken();
        }
        this.startRefreshTokenTimer(token);
        return token;
      } catch {
        this.clearTokens();
      }
    }
    return null;
  }

  isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.role === 'admin';
  }

  setTokens({ token, refreshToken }: AuthTokens) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.startRefreshTokenTimer(token);
  }

  clearTokens() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.stopRefreshTokenTimer();
  }

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isPersistentSession() {
    return localStorage.getItem('persist_session') === 'true';
  }

  setPersistentSession(persist: boolean) {
    localStorage.setItem('persist_session', String(persist));
  }

  private async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const response = await api.post('/auth/refresh-token', { refreshToken });
      this.setTokens(response.data);
      return response.data.token;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  private startRefreshTokenTimer(token: string) {
    const decoded = jwtDecode<DecodedToken>(token);
    const expires = new Date(decoded.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}

export const authService = new AuthService();
