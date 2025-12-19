import { api } from '../../../lib/axios';
// ✅ FIX: Use simple relative path and add 'type' keyword just in case
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/index'; 

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signin', credentials);
    return data;
  },
  
  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/signup', credentials);
    return data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/user/profile');
    return data;
  },

  logout: async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
};