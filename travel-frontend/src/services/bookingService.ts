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
  const response = await apiService.put<Booking>(
    `/api/bookings/${id}/status`,
    `"${status}"` // send as raw JSON string with quotes
  );
  return response.data;
}


}