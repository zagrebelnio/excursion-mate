using backend.Models.DTO;

namespace backend.Services
{
    public interface IBookingService
    {
        Task<bool> RegisterUserForExcursionAsync(int excursionId, string userId);
        Task<List<ExcursionDTO>> GetUserRegisteredExcursionsAsync(string userId);
    }
}
