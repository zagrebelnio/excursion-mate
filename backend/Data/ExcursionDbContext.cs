using backend.Models.Domain;
using backend.Seed;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Data
{
    public class ExcursionDbContext : IdentityDbContext<User>
    {
        public ExcursionDbContext(DbContextOptions<ExcursionDbContext> options) : base(options) { }

        public DbSet<Excursion> Excursions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Excursion>()
                .Property(e => e.Price)
                .HasColumnType("decimal(6,2)");

            builder.Entity<Excursion>()
                .HasOne(e => e.User)
                .WithMany(u => u.Excursions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<IdentityRole>().HasData(RoleSeedData.GetRoles());
        }
    }
}
