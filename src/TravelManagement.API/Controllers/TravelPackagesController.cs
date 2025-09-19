// ==================== TravelPackagesController.cs ====================
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TravelPackagesController : ControllerBase
{
    private readonly ITravelPackageService _packageService;

    public TravelPackagesController(ITravelPackageService packageService)
    {
        _packageService = packageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TravelPackageDto>>> GetAllPackages()
    {
        var packages = await _packageService.GetAllPackagesAsync();
        return Ok(packages);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<TravelPackageDto>>> GetActivePackages()
    {
        var packages = await _packageService.GetActivePackagesAsync();
        return Ok(packages);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TravelPackageDto>> GetPackage(int id)
    {
        var package = await _packageService.GetPackageByIdAsync(id);
        if (package == null)
            return NotFound();

        return Ok(package);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<TravelPackageDto>>> SearchPackages(
        [FromQuery] string? destination,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var packages = await _packageService.SearchPackagesAsync(destination, minPrice, maxPrice);
        return Ok(packages);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TravelPackageDto>> CreatePackage(CreateTravelPackageDto createPackageDto)
    {
        var package = await _packageService.CreatePackageAsync(createPackageDto);
        return CreatedAtAction(nameof(GetPackage), new { id = package.Id }, package);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TravelPackageDto>> UpdatePackage(int id, UpdateTravelPackageDto updatePackageDto)
    {
        var package = await _packageService.UpdatePackageAsync(id, updatePackageDto);
        if (package == null)
            return NotFound();

        return Ok(package);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeletePackage(int id)
    {
        var result = await _packageService.DeletePackageAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}