// ==================== Booking.cs ====================
namespace TravelManagement.API.Models.Entities;

public class Booking : BaseEntity
{
    public int UserId { get; set; }
    public int TravelPackageId { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public int NumberOfTravelers { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
    public string? SpecialRequests { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public TravelPackage TravelPackage { get; set; } = null!;
}