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
        public DbSet<ExcursionReaction> ExcursionReactions { get; set; }

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

            builder.Entity<ExcursionReaction>().
                HasKey(er => new { er.UserId, er.ExcursionId });

            builder.Entity<ExcursionReaction>()
                .HasOne(er => er.User)
                .WithMany(u => u.ExcursionReactions) 
                .HasForeignKey(er => er.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<ExcursionReaction>()
                .HasOne(er => er.Excursion)
                .WithMany(e => e.ExcursionReactions) 
                .HasForeignKey(er => er.ExcursionId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<ExcursionReaction>()
                .Property(er => er.ReactionType)
                .HasConversion<int>();

            builder.Entity<Excursion>()
                .Property(e => e.Likes)
                .HasDefaultValue(0);

            builder.Entity<Excursion>()
                .Property(e => e.Dislikes)
                .HasDefaultValue(0);

            builder.Entity<IdentityRole>().HasData(RoleSeedData.GetRoles());
        }
    }
}
