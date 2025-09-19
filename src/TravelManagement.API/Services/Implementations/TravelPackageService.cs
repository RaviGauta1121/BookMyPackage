
// ==================== TravelPackageService.cs ====================
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelManagement.API.Data;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Models.Entities;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Services.Implementations;

public class TravelPackageService : ITravelPackageService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public TravelPackageService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TravelPackageDto>> GetAllPackagesAsync()
    {
        var packages = await _context.TravelPackages.ToListAsync();
        return _mapper.Map<IEnumerable<TravelPackageDto>>(packages);
    }

    public async Task<IEnumerable<TravelPackageDto>> GetActivePackagesAsync()
    {
        var packages = await _context.TravelPackages
            .Where(p => p.IsActive && p.StartDate > DateTime.UtcNow)
            .ToListAsync();
        return _mapper.Map<IEnumerable<TravelPackageDto>>(packages);
    }

    public async Task<TravelPackageDto?> GetPackageByIdAsync(int id)
    {
        var package = await _context.TravelPackages.FindAsync(id);
        return package == null ? null : _mapper.Map<TravelPackageDto>(package);
    }

    public async Task<TravelPackageDto> CreatePackageAsync(CreateTravelPackageDto createPackageDto)
    {
        var package = _mapper.Map<TravelPackage>(createPackageDto);
        package.AvailableSlots = package.MaxCapacity;
        
        _context.TravelPackages.Add(package);
        await _context.SaveChangesAsync();
        
        return _mapper.Map<TravelPackageDto>(package);
    }

    public async Task<TravelPackageDto?> UpdatePackageAsync(int id, UpdateTravelPackageDto updatePackageDto)
    {
        var package = await _context.TravelPackages.FindAsync(id);
        if (package == null) return null;

        _mapper.Map(updatePackageDto, package);
        package.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return _mapper.Map<TravelPackageDto>(package);
    }

    public async Task<bool> DeletePackageAsync(int id)
    {
        var package = await _context.TravelPackages.FindAsync(id);
        if (package == null) return false;

        _context.TravelPackages.Remove(package);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TravelPackageDto>> SearchPackagesAsync(string? destination, decimal? minPrice, decimal? maxPrice)
    {
        var query = _context.TravelPackages.Where(p => p.IsActive);

        if (!string.IsNullOrEmpty(destination))
        {
            query = query.Where(p => p.Destination.Contains(destination));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice);
        }

        var packages = await query.ToListAsync();
        return _mapper.Map<IEnumerable<TravelPackageDto>>(packages);
    }
}