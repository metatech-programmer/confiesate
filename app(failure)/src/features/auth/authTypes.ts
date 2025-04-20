export interface User {
  uuid: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'anonymous';
  isAnonymous?: boolean;
  sessionExpiry?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refreshToken: string | null;
  sessionExpiry: number | null;
}
