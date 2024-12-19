using backend.Data;
using backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class RecommendationRepository : IRecomendationsRepository
    {
        private readonly ExcursionDbContext excursionDbContext;

        public RecommendationRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }
        public async Task<Excursion?> GetRecommendedExcursionAsync(string userId)
        {
            var lastViewedExcursion = await excursionDbContext.ViewedExcursions
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.ViewedAt)
                .Select(v => v.Excursion)
                .FirstOrDefaultAsync();

            if (lastViewedExcursion == null)
                return null; 

            var recommendedExcursion = await excursionDbContext.Excursions
                .Where(e =>
                    e.City == lastViewedExcursion.City && 
                    e.Date > DateTime.UtcNow &&          
                    e.UserId != userId)                 
                .OrderByDescending(e => e.Likes)        
                .FirstOrDefaultAsync();

            return recommendedExcursion;
        }
    }
}
