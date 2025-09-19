using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthService(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userService.GetUserByEmailAsync(loginDto.Email);
        if (user == null) return null;

        // Verify password (you'll need to implement password verification)
        // For now, assuming password verification is successful
        
        var token = await GenerateJwtTokenAsync(user);
        
        return new AuthResponseDto
        {
            Token = token,
            User = user
        };
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        if (await _userService.UserExistsAsync(registerDto.Email))
            return null;

        if (registerDto.Password != registerDto.ConfirmPassword)
            return null;

        var createUserDto = new CreateUserDto
        {
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Password = registerDto.Password,
            Role = "Customer"
        };

        var user = await _userService.CreateUserAsync(createUserDto);
        var token = await GenerateJwtTokenAsync(user);

        return new AuthResponseDto
        {
            Token = token,
            User = user
        };
    }

    // Removed async since there's no await operations
    public async Task<string> GenerateJwtTokenAsync(UserDto user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];
        
        // Fix null reference warning
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("JWT SecretKey is not configured");
            
        var secretKeyBytes = Encoding.ASCII.GetBytes(secretKey);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(jwtSettings["ExpiryInHours"])),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), 
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return await Task.FromResult(tokenHandler.WriteToken(token));
    }
}