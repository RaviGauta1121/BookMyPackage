// ==================== BookingsController.cs ====================
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [HttpGet("my-bookings")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings()
    {
        var userId = GetCurrentUserId();
        var bookings = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetBooking(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null)
            return NotFound();

        var userId = GetCurrentUserId();
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (booking.UserId != userId && userRole != "Admin")
            return Forbid();

        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto createBookingDto)
    {
        var userId = GetCurrentUserId();
        var booking = await _bookingService.CreateBookingAsync(userId, createBookingDto);
        
        if (booking == null)
            return BadRequest("Unable to create booking. Package may not exist or insufficient slots available.");

        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookingDto>> UpdateBookingStatus(int id, [FromBody] string status)
    {
        var booking = await _bookingService.UpdateBookingStatusAsync(id, status);
        if (booking == null)
            return NotFound();

        return Ok(booking);
    }

    [HttpPut("{id}/cancel")]
    public async Task<ActionResult> CancelBooking(int id)
    {
        var userId = GetCurrentUserId();
        var result = await _bookingService.CancelBookingAsync(id, userId);
        
        if (!result)
            return NotFound();

        return Ok(new { message = "Booking cancelled successfully" });
    }

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}