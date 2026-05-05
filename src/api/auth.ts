import { apiClient } from './client';

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'OWNER' | 'BROKER' | 'BUYER';
  brokerProfile?: {
    cnpj?: string;
    licenseNumber?: string;
    bio?: string;
    cityRegion?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>('/auth/signup', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),
};
