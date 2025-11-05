export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  username: string;
}

export interface User {
  username: string;
  token: string;
}