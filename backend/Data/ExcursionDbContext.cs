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
        public DbSet<ExcursionUser> ExcursionUsers { get; set; }
        public DbSet<FavoriteExcursion> FavoriteExcursions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Excursion>()
                .Property(e => e.Price)
                .HasColumnType("int");

            builder.Entity<Excursion>()
                .HasOne(e => e.User)
                .WithMany(u => u.Excursions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ExcursionUser>()
                .HasKey(eu => new { eu.UserId, eu.ExcursionId });

            builder.Entity<ExcursionUser>()
                .HasOne(eu => eu.User)
                .WithMany(u => u.ExcursionUsers)
                .HasForeignKey(eu => eu.UserId)
                .OnDelete(DeleteBehavior.NoAction); 

            builder.Entity<ExcursionUser>()
                .HasOne(eu => eu.Excursion)
                .WithMany(e => e.ExcursionUsers)
                .HasForeignKey(eu => eu.ExcursionId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<FavoriteExcursion>()
                .HasKey(fe => new { fe.UserId, fe.ExcursionId });

            builder.Entity<FavoriteExcursion>()
                .HasOne(fe => fe.User)
                .WithMany(u => u.FavoriteExcursions)
                .HasForeignKey(fe => fe.UserId)
                .OnDelete(DeleteBehavior.NoAction); 

            builder.Entity<FavoriteExcursion>()
                .HasOne(fe => fe.Excursion)
                .WithMany(e => e.FavoriteExcursions)
                .HasForeignKey(fe => fe.ExcursionId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<IdentityRole>().HasData(RoleSeedData.GetRoles());
        }
    }
}
