export interface User {
  username: string;
  password?: string;
  twoFactorSecret?: string;
  expired?: boolean;
  genDate?: Date;
}

export interface AuthResponse {
  status: 'success' | 'error' | 'expired';
  message: string;
  user?: {
    username: string;
    days_until_expiration: number;
  };
  action?: 'renew_credentials';
}

export interface GeneratePasswordResponse {
  qrCode: string;
  password: string;
}

export interface Generate2FAResponse {
  qrCode: string;
  secret: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export type Page = 'home' | 'create-account' | 'login' | 'renew-credentials' | 'dashboard';

export interface AuthUser {
  username: string;
  days_until_expiration: number;
}