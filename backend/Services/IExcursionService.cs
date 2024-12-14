using backend.Models.DTO;

namespace backend.Services
{
    public interface IExcursionService
    {
        Task<PagedResponse<ExcursionDTO>> GetPagedExcursionsAsync(
        string? userId,
        string? title,
        string? city,
        int? minPrice,
        int? maxPrice,
        DateTime? date,
        int page,
        int pageSize);
    }
}
