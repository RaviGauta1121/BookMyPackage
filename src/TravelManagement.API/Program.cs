using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TravelManagement.API.Data;
using TravelManagement.API.Services.Interfaces;
using TravelManagement.API.Services.Implementations;
using TravelManagement.API.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - Using SQLite
builder.Services.AddDbContext<TravelDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Services
builder.Services.AddScoped<ITravelPackageService, TravelPackageService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// ==================== CORS ====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React frontend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // If you use cookies/auth headers
    });
});

var app = builder.Build();

// Create database and tables if they don't exist
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TravelDbContext>();

    Console.WriteLine("Attempting to create database...");
    var created = context.Database.EnsureCreated();
    Console.WriteLine($"Database created: {created}");

    try
    {
        var userCount = context.Users.Count();
        Console.WriteLine($"Users table exists. Current count: {userCount}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Users table check failed: {ex.Message}");
    }
}

// ==================== Middleware ====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // keep disabled if frontend calls http://localhost:5000

app.UseCors("AllowWebApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
