using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IExcursionRepository
    {
        Task<List<Excursion>> GetAllAsync();
    }
}
