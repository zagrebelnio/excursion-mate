
using AutoMapper;
using backend.Repositories;

namespace backend.Services
{
    public class FavoriteExcursionService : IFavoriteExcursionService
    {
        private readonly IFavoriteExcursionRepository favoriteExcursionRepository;

        public FavoriteExcursionService(IFavoriteExcursionRepository favoriteExcursionRepository)
        {
            this.favoriteExcursionRepository = favoriteExcursionRepository;
        }
        public async Task AddToFavoritesAsync(string userId, int excursionId)
        {
            var isFavorite = await favoriteExcursionRepository.IsFavoriteAsync(userId, excursionId);

            if (isFavorite)
            {
                throw new Exception("Excursion is already in favorites.");
            }

            await favoriteExcursionRepository.AddAsync(userId, excursionId);
        }
    }
}
