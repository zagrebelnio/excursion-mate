using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Services
{
    public interface IRecommendationService
    {
        Task<ExcursionDTO?> GetSingleRecommendationAsync(string userId);
    }
}
