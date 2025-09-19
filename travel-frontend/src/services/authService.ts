// ==================== src/services/authService.ts ====================
import { apiService } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const response = await apiService.post<AuthResponse>('/api/auth/login', credentials);
      console.log('Login successful:', response.data);

      // Store auth data
      this.setAuthToken(response.data.token);
      this.setUser(response.data.user);

      return response.data;
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('Unexpected error during login');
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { email: userData.email, firstName: userData.firstName });
      const response = await apiService.post<AuthResponse>('/api/auth/register', userData);
      console.log('Registration successful:', response.data);

      // Store auth data
      this.setAuthToken(response.data.token);
      this.setUser(response.data.user);

      return response.data;
    } catch (error: unknown) {
      if (this.isAxiosError(error)) {
        console.error('Registration error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('Unexpected error during registration');
    }
  }

  // ==================== Local Storage Helpers ====================

  static setAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  static getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static removeAuthToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.removeAuthToken(); // Clear corrupted data
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!(this.getAuthToken() && this.getUser());
  }

  static logout(): void {
    this.removeAuthToken();
  }

  // ==================== Utils ====================

  private static isAxiosError(error: unknown): error is { response?: { data?: any; status?: number }; message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }
}
