// ==================== BookingService.cs ====================
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelManagement.API.Data;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Models.Entities;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Services.Implementations;

public class BookingService : IBookingService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public BookingService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
    {
        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.TravelPackage)
            .ToListAsync();
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId)
    {
        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.TravelPackage)
            .Where(b => b.UserId == userId)
            .ToListAsync();
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<BookingDto?> GetBookingByIdAsync(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.TravelPackage)
            .FirstOrDefaultAsync(b => b.Id == id);
        return booking == null ? null : _mapper.Map<BookingDto>(booking);
    }

    public async Task<BookingDto?> CreateBookingAsync(int userId, CreateBookingDto createBookingDto)
    {
        var package = await _context.TravelPackages.FindAsync(createBookingDto.TravelPackageId);
        if (package == null || package.AvailableSlots < createBookingDto.NumberOfTravelers)
            return null;

        var booking = _mapper.Map<Booking>(createBookingDto);
        booking.UserId = userId;
        booking.TotalPrice = package.Price * createBookingDto.NumberOfTravelers;
        booking.Status = "Pending";

        // Update available slots
        package.AvailableSlots -= createBookingDto.NumberOfTravelers;

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return await GetBookingByIdAsync(booking.Id);
    }

    public async Task<BookingDto?> UpdateBookingStatusAsync(int id, string status)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return null;

        booking.Status = status;
        booking.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return await GetBookingByIdAsync(id);
    }

    public async Task<bool> CancelBookingAsync(int id, int userId)
    {
        var booking = await _context.Bookings
            .Include(b => b.TravelPackage)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        
        if (booking == null || booking.Status == "Cancelled") 
            return false;

        booking.Status = "Cancelled";
        booking.UpdatedAt = DateTime.UtcNow;

        // Restore available slots
        booking.TravelPackage.AvailableSlots += booking.NumberOfTravelers;

        await _context.SaveChangesAsync();
        return true;
    }
}