﻿using backend.Models.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AuthDbContext : IdentityDbContext<User>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        }
    }
}
