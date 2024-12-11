using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Repositories
{
    public interface IExcursionRepository
    {
        Task<(List<Excursion> Items, int TotalCount)> GetAllAsync(string? title, string? city, int? minPrice, int? maxPrice, DateTime? date, int page, int pageSize);
        Task<Excursion> CreateAsync(AddExcursionDTO addExcursionDTO, string userId);
        Task<Excursion?> GetByIdAsync(int id);
        Task<Excursion?> DeleteAsync(int id);
        Task<Excursion?> UpdateAsync(int id, EditExcursionDTO editExcursionDTO);
        Task<bool> IsUserOwnerAsync(int excursionId, string userId);
    }
}
