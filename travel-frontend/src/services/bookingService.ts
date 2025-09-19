// ==================== src/services/bookingService.ts ====================
import { apiService } from './api';
import { Booking, CreateBookingRequest } from '../types/booking';

export class BookingService {
  static async getAllBookings(): Promise<Booking[]> {
    const response = await apiService.get<Booking[]>('/api/bookings');
    return response.data;
  }

  static async getMyBookings(): Promise<Booking[]> {
    const response = await apiService.get<Booking[]>('/api/bookings/my-bookings');
    return response.data;
  }

  static async getBookingById(id: number): Promise<Booking> {
    const response = await apiService.get<Booking>(`/api/bookings/${id}`);
    return response.data;
  }

  static async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await apiService.post<Booking>('/api/bookings', bookingData);
    return response.data;
  }

  static async cancelBooking(id: number): Promise<void> {
    await apiService.put(`/api/bookings/${id}/cancel`);
  }

  static async updateBookingStatus(id: number, status: string): Promise<Booking> {
    // Fix: Use only 2 arguments - URL and data
    const response = await apiService.put<Booking>(
      `/api/bookings/${id}/status`, 
      { status } // Send as object instead of stringified
    );
    return response.data;
  }
}