using backend.Data;
using backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ExcursionDbContext excursionDbContext;

        public BookingRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }

        public async Task<Excursion?> GetExcursionByIdAsync(int id)
        {
            return await excursionDbContext.Excursions.Include(e => e.ExcursionUsers).FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<bool> IsUserRegisteredForExcursionAsync(int excursionId, string userId)
        {
            return await excursionDbContext.ExcursionUsers.AnyAsync(eu => eu.ExcursionId == excursionId && eu.UserId == userId);
        }

        public async Task RegisterUserForExcursionAsync(int excursionId, string userId)
        {
            if (await IsUserRegisteredForExcursionAsync (excursionId, userId))
            {
                throw new InvalidOperationException("User is already registered for this excursion.");
            }

            var excursionUser = new ExcursionUser
            {
                ExcursionId = excursionId,
                UserId = userId,
                RegistrationDate = DateTime.UtcNow
            };

            await excursionDbContext.ExcursionUsers.AddAsync(excursionUser);
            await excursionDbContext.SaveChangesAsync();
        }
    }
}
