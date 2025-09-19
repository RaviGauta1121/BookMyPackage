// ==================== TravelPackage.cs ====================
namespace TravelManagement.API.Models.Entities;

public class TravelPackage : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; } // Duration in days
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MaxCapacity { get; set; }
    public int AvailableSlots { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}