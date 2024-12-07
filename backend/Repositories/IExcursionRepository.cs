using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IExcursionRepository
    {
        Task<List<Excursion>> GetAllAsync();
        Task<Excursion> CreateAsync(Excursion excursion);
        Task<Excursion?> GetByIdAsync(int id);
    }
}
