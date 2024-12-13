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

        public async Task<FavoriteExcursion?> AddAsync(string userId, int excursionId)
        {
            var favorite = new FavoriteExcursion
            {
                UserId = userId,
                ExcursionId = excursionId,
                AddedDate = DateTime.Now,
            };

            excursionDbContext.FavoriteExcursions.Add(favorite);
            await excursionDbContext.SaveChangesAsync();
            return favorite;
        }

        public async Task<List<FavoriteExcursion>> GetAllAsync(string userId)
        {
            return await excursionDbContext.FavoriteExcursions
                .Where(f => f.UserId == userId)
                .Include(f => f.ExcursionId)
                .ToListAsync();
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
    }
}
