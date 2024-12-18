using AutoMapper;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly IRecomendationsRepository recomendationsRepository;
        private readonly IMapper mapper;

        public RecommendationService(IRecomendationsRepository recomendationsRepository, IMapper mapper)
        {
            this.recomendationsRepository = recomendationsRepository;
            this.mapper = mapper;
        }

        public async Task<ExcursionDTO?> GetSingleRecommendationAsync(string userId)
        {
            var excursion = await recomendationsRepository.GetRecommendedExcursionAsync(userId);
            if (excursion == null) return null; 
            return mapper.Map<ExcursionDTO>(excursion);
        }
    }
}
