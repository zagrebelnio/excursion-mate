namespace backend.Services
{
    public interface IBookingService
    {
        Task<bool> RegisterUserForExcursionAsync(int excursionId, string userId);
    }
}
