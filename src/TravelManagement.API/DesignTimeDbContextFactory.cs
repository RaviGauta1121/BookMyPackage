using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TravelManagement.API.Data;

namespace TravelManagement.API;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TravelDbContext>
{
    public TravelDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TravelDbContext>();
        optionsBuilder.UseSqlite("Data Source=TravelManagement.db");
        
        return new TravelDbContext(optionsBuilder.Options);
    }
}