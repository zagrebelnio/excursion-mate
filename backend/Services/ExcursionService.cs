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
                    dto.Reaction = await excursionRepository.GetReactionAsync(userId, dto.Id);
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

        public async Task<ExcursionDetailsDTO?> GetExcursionDetailsAsync(int id, string? userId)
        {
            var excursion = await excursionRepository.GetByIdAsync(id);
            if (excursion == null) return null;

            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(excursion);

            if (excursion.Photo != null)
            {
                excursionDTO.Photo = Convert.ToBase64String(excursion.Photo);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                excursionDTO.IsFavorite = await favoriteExcursionRepository.IsFavoriteAsync(userId, id);
                excursionDTO.Reaction = await excursionRepository.GetReactionAsync(userId, id);
            }

            return excursionDTO;
        }
    }
}
