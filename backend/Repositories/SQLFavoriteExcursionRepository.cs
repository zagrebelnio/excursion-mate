using backend.Data;
using backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SQLFavoriteExcursionRepository : IFavoriteExcursionRepository
    {
        
        private readonly ExcursionDbContext excursionDbContext;

        public SQLFavoriteExcursionRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }

        public async Task<List<FavoriteExcursion>> GetAllAsync(string userId)
        {
            return await excursionDbContext.FavoriteExcursions
                .Where(f => f.UserId == userId)
                .Include(f => f.Excursion)
                .ToListAsync();
        }

        public async Task<bool> IsFavoriteAsync(string userId, int excursionId)
        {
            return await excursionDbContext.FavoriteExcursions.AnyAsync(fe => fe.UserId == userId && fe.ExcursionId == excursionId);
        }

        public async Task<FavoriteExcursion?> RemoveAsync(string userId, int excursionId)
        {
            var favorite = await excursionDbContext.FavoriteExcursions.FirstOrDefaultAsync(f => f.UserId == userId && f.ExcursionId == excursionId);

            if (favorite != null)
            {
                excursionDbContext.FavoriteExcursions.Remove(favorite);
                await excursionDbContext.SaveChangesAsync();
            }
            return null;
        }

        public async Task AddAsync(string userId, int excursionId)
        {
            var excursion = await excursionDbContext.Excursions.FindAsync(excursionId);

            if (excursion == null)
            {
                throw new Exception("Excursion not found.");
            }

            var favoriteExcursion = new FavoriteExcursion
            {
                UserId = userId,
                ExcursionId = excursionId
            };

            excursionDbContext.FavoriteExcursions.Add(favoriteExcursion);
            await excursionDbContext.SaveChangesAsync();
        }

    }
}
