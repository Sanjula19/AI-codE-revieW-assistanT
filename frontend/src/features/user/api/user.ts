import { api } from '../../../lib/axios';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  // password?: string; // Future feature
}

export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ message: string, user: UserProfile }> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};