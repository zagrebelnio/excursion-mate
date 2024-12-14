using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class ExcursionService : IExcursionService
    {
        private readonly IExcursionRepository excursionRepository;
        private readonly IMapper mapper;
        private readonly IFavoriteExcursionRepository favoriteExcursionRepository;

        public ExcursionService(IExcursionRepository excursionRepository, IMapper mapper, IFavoriteExcursionRepository favoriteExcursionRepository)
        {
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
            this.favoriteExcursionRepository = favoriteExcursionRepository;
        }

        public async Task<PagedResponse<ExcursionDTO>> GetPagedExcursionsAsync(string? userId, string? title, string? city, int? minPrice, int? maxPrice, DateTime? date, int page, int pageSize)
        {
            var excursions = await excursionRepository.GetAllAsync(title, city, minPrice, maxPrice, date, page, pageSize);
            var excursionDtos = mapper.Map<List<ExcursionDTO>>(excursions.Items);

            if (!string.IsNullOrEmpty(userId))
            {
                foreach (var dto in excursionDtos)
                {
                    dto.IsFavorite = await favoriteExcursionRepository.IsFavoriteAsync(userId, dto.Id);
                }
            }

            return new PagedResponse<ExcursionDTO>
            {
                Items = excursionDtos,
                TotalItems = excursions.TotalCount,  
                TotalPages = (int)Math.Ceiling((double)excursions.TotalCount / pageSize),
                CurrentPage = page,
                PageSize = pageSize
            };
        }
    }
}
