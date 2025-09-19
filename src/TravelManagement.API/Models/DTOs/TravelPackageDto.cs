// ==================== TravelPackageDto.cs ====================
namespace TravelManagement.API.Models.DTOs;

public class TravelPackageDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MaxCapacity { get; set; }
    public int AvailableSlots { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTravelPackageDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MaxCapacity { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateTravelPackageDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MaxCapacity { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}