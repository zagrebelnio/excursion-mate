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

        public async Task<List<Excursion>> GetUserRegisteredExcursionsAsync(string userId)
        {
            return await excursionDbContext.ExcursionUsers
                .Where(eu  => eu.UserId == userId)
                .Include(eu => eu.Excursion)
                .Select(eu => eu.Excursion)
                .ToListAsync();
        }

        public async Task<int> GetUserRegisteredExcursionsCountAsync(string userId)
        {
            return await excursionDbContext.ExcursionUsers.Where(eu => eu.UserId == userId).CountAsync();
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

        public async Task<bool> UnregisterUserFromExcursionAsync(int excursionId, string userId)
        {
            var excursionUser = await excursionDbContext.ExcursionUsers.FirstOrDefaultAsync(eu => eu.ExcursionId == excursionId && eu.UserId == userId);
            if (excursionUser == null) return false;
            excursionDbContext.ExcursionUsers.Remove(excursionUser);

            var excursion = await excursionDbContext.Excursions.FindAsync(excursionId);
            if (excursion != null)
            {
                excursion.CurrentParticipants -= 1;
                excursionDbContext.Excursions.Update(excursion);
            }

            await excursionDbContext.SaveChangesAsync();
            return true;
        }
    }
}
