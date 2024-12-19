using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IRecomendationsRepository
    {
        Task<Excursion?> GetRecommendedExcursionAsync(string userId);
    }
}
