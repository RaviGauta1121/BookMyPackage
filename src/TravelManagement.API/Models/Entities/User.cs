// ==================== User.cs ====================
namespace TravelManagement.API.Models.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // Admin, Customer
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}