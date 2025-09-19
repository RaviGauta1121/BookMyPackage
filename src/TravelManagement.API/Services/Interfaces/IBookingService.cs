// ==================== IBookingService.cs ====================
using TravelManagement.API.Models.DTOs;

namespace TravelManagement.API.Services.Interfaces;

public interface IBookingService
{
    Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
    Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId);
    Task<BookingDto?> GetBookingByIdAsync(int id);
    Task<BookingDto?> CreateBookingAsync(int userId, CreateBookingDto createBookingDto);
    Task<BookingDto?> UpdateBookingStatusAsync(int id, string status);
    Task<bool> CancelBookingAsync(int id, int userId);
}