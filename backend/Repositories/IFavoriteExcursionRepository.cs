using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IFavoriteExcursionRepository
    {
        Task<FavoriteExcursion?> AddAsync(string userId, int excursionId);
        Task<FavoriteExcursion?> RemoveAsync(string userId, int excursionId);
        Task<List<FavoriteExcursion>> GetAllAsync(string userId);
    }
}
