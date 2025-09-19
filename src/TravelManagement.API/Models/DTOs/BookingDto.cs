// ==================== BookingDto.cs ====================
namespace TravelManagement.API.Models.DTOs;

public class BookingDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int TravelPackageId { get; set; }
    public string PackageTitle { get; set; } = string.Empty;
    public DateTime BookingDate { get; set; }
    public int NumberOfTravelers { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? SpecialRequests { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBookingDto
{
    public int TravelPackageId { get; set; }
    public int NumberOfTravelers { get; set; }
    public string? SpecialRequests { get; set; }
}