// ==================== UserService.cs ====================
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelManagement.API.Data;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Models.Entities;
using TravelManagement.API.Services.Interfaces;

namespace TravelManagement.API.Services.Implementations;

public class UserService : IUserService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public UserService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.ToListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = _mapper.Map<User>(createUserDto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        _mapper.Map(updateUserDto, user);
        user.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return _mapper.Map<UserDto>(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}