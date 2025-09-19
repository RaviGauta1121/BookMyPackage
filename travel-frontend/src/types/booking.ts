// ==================== src/types/booking.ts ====================
export interface Booking {
  id: number;
  userId: number;
  userName: string;
  travelPackageId: number;
  packageTitle: string;
  bookingDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  travelPackageId: number;
  numberOfTravelers: number;
  specialRequests?: string;
}