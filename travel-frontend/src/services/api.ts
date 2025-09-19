// ==================== src/services/api.ts ====================
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url);
  }

  public post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data);
  }

  public put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data);
  }

  public delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url);
  }
}

export const apiService = new ApiService();
