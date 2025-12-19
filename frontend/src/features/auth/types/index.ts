export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}