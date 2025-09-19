// ==================== ITravelPackageService.cs ====================
using TravelManagement.API.Models.DTOs;

namespace TravelManagement.API.Services.Interfaces;

public interface ITravelPackageService
{
    Task<IEnumerable<TravelPackageDto>> GetAllPackagesAsync();
    Task<IEnumerable<TravelPackageDto>> GetActivePackagesAsync();
    Task<TravelPackageDto?> GetPackageByIdAsync(int id);
    Task<TravelPackageDto> CreatePackageAsync(CreateTravelPackageDto createPackageDto);
    Task<TravelPackageDto?> UpdatePackageAsync(int id, UpdateTravelPackageDto updatePackageDto);
    Task<bool> DeletePackageAsync(int id);
    Task<IEnumerable<TravelPackageDto>> SearchPackagesAsync(string? destination, decimal? minPrice, decimal? maxPrice);
}