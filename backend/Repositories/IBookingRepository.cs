using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IBookingRepository
    {
        Task<Excursion?> GetExcursionByIdAsync(int id);
        Task<bool> IsUserRegisteredForExcursionAsync(int excursionId, string userId);
        Task RegisterUserForExcursionAsync(int excursionId, string userId);
        Task<int> GetUserRegisteredExcursionsCountAsync(string userId);
        Task<List<Excursion>> GetUserRegisteredExcursionsAsync(string userId);
        Task<bool> UnregisterUserFromExcursionAsync(int excursionId, string userId);
    }
}
