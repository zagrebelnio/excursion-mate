using AutoMapper;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class ViewedExcursionService : IViewedExcursionService
    {
        private readonly IExcursionRepository excursionRepository;
        private readonly IMapper mapper;

        public ViewedExcursionService(IExcursionRepository excursionRepository, IMapper mapper)
        {
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
        }

        public async Task MarkAsViewedAsync(string userId, AddViewedExcursionDTO dto)
        {
            if (string.IsNullOrEmpty(userId)) throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

            var existingViewedExcursion = await excursionRepository.GetViewedExcursionAsync(userId, dto.ExcursionId);
            if (existingViewedExcursion != null)
            {
                existingViewedExcursion.ViewedAt = DateTime.UtcNow;
                await excursionRepository.UpdateViewedExcursionAsync(existingViewedExcursion);
            }
            else
            {
                var viewedExcursion = mapper.Map<ViewedExcursion>(dto);
                viewedExcursion.UserId = userId;
                viewedExcursion.ViewedAt = DateTime.UtcNow;
                await excursionRepository.AddViewedExcursionAsync(viewedExcursion);
            }
        }
    }
}
