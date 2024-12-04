using backend.Models.Domain;
using backend.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Data
{
    public class ExcursionDbContext : DbContext
    {
        public ExcursionDbContext(DbContextOptions<ExcursionDbContext> options) : base(options) { }

        public DbSet<Excursion> Excursions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
