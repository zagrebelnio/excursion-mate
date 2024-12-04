using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ExcursionDbContext : DbContext
    {
        public ExcursionDbContext(DbContextOptions<ExcursionDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
