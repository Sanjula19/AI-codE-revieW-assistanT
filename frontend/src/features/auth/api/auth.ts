import { api } from '../../../lib/axios';
import type { User, LoginCredentials, RegisterCredentials } from '../features/auth/types';
// Note: We will create the 'types' file in the next step.

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signin', credentials);
    return data;
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/signup', credentials);
    return data;
  },

  // Get Current User Profile
  getProfile: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/user/profile');
    return data;
  },

  // Logout
  logout: async () => {
    // We just remove tokens on client, but good to tell server too
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
};