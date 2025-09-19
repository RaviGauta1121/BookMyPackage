// ==================== IAuthService.cs ====================
using TravelManagement.API.Models.DTOs;

namespace TravelManagement.API.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<string> GenerateJwtTokenAsync(UserDto user);
}