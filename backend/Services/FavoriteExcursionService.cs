
using AutoMapper;
using backend.Repositories;

namespace backend.Services
{
    public class FavoriteExcursionService : IFavoriteExcursionService
    {
        private readonly IFavoriteExcursionRepository favoriteExcursionRepository;
        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContextAccessor;

        public FavoriteExcursionService(IFavoriteExcursionRepository favoriteExcursionRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            this.favoriteExcursionRepository = favoriteExcursionRepository;
            this.mapper = mapper;
            this.httpContextAccessor = httpContextAccessor;
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
