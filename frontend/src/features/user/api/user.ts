import axios from 'axios';

// 1. THIS WAS MISSING BEFORE - The interface definition
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
}

// 2. Create the API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// 3. The Interceptor: This automatically adds the token to requests
api.interceptors.request.use((config) => {
  // Try both common names just to be safe
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Export the API methods
export const userApi = {
  getProfile: async () => {
    const response = await api.get<UserProfile>('/user/profile');
    return response.data;
  },
  updateProfile: async (data: { username: string; email: string }) => {
    const response = await api.put<{ user: UserProfile }>('/user/profile', data);
    return response.data;
  }
};