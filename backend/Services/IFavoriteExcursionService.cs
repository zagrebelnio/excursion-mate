using backend.Models.Domain;

namespace backend.Services
{
    public interface IFavoriteExcursionService
    {
        Task AddToFavoritesAsync(string userId, int excursionId);
    }
}
