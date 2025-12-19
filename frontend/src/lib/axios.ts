import axios from 'axios';

// 1. Create the instance
// We use the URL from your backend (.env) or default to localhost:5000
export const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    // We will store the token in localStorage
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['x-access-token'] = token; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Call your backend refresh endpoint
        const { data } = await axios.post('http://localhost:5000/api/auth/refreshtoken', {
          refreshToken,
        });

        // Store new tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Update header and retry original request
        originalRequest.headers['x-access-token'] = data.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - Logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);