// ==================== TravelDbContext.cs ====================
using Microsoft.EntityFrameworkCore;
using TravelManagement.API.Models.Entities;

namespace TravelManagement.API.Data;

public class TravelDbContext : DbContext
{
    public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<TravelPackage> TravelPackages { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // TravelPackage entity configuration
        modelBuilder.Entity<TravelPackage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Destination).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        });

        // Booking entity configuration
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.TravelPackage)
                  .WithMany(tp => tp.Bookings)
                  .HasForeignKey(e => e.TravelPackageId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed admin user
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "admin@travel.com",
                FirstName = "Admin",
                LastName = "User",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed travel packages
        modelBuilder.Entity<TravelPackage>().HasData(
            new TravelPackage
            {
                Id = 1,
                Title = "Paris City Break",
                Description = "Explore the City of Light with our 4-day Paris adventure package.",
                Destination = "Paris, France",
                Price = 899.99m,
                Duration = 4,
                MaxCapacity = 20,
                AvailableSlots = 20,
                StartDate = DateTime.UtcNow.AddDays(30),
                EndDate = DateTime.UtcNow.AddDays(34),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new TravelPackage
            {
                Id = 2,
                Title = "Tokyo Discovery",
                Description = "Experience the blend of traditional and modern Japan in Tokyo.",
                Destination = "Tokyo, Japan",
                Price = 1299.99m,
                Duration = 7,
                MaxCapacity = 15,
                AvailableSlots = 15,
                StartDate = DateTime.UtcNow.AddDays(45),
                EndDate = DateTime.UtcNow.AddDays(52),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}