using backend.Data;
using backend.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SQLUserRepository : IUserRepository
    {

        private readonly ExcursionDbContext excursionDbContext;

        public SQLUserRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }
        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await excursionDbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}
