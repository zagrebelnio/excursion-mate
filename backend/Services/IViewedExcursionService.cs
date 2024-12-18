using backend.Models.DTO;

namespace backend.Services
{
    public interface IViewedExcursionService
    {
        Task MarkAsViewedAsync(string userId, AddViewedExcursionDTO dto);
    }
}
