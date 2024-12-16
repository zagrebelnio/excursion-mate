
using backend.Repositories;

namespace backend.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            this.bookingRepository = bookingRepository;
        }
        public async Task<bool> RegisterUserForExcursionAsync(int excursionId, string userId)
        {
            var registeredExcursionsCount = await bookingRepository.GetUserRegisteredExcursionsCountAsync(userId);

            if (registeredExcursionsCount >= 5) throw new InvalidOperationException("You cannot register for more than 5 excursions.");
            var excursion = await bookingRepository.GetExcursionByIdAsync(excursionId);
            if (excursion == null) throw new KeyNotFoundException("Excursion not found.");
            await bookingRepository.RegisterUserForExcursionAsync(excursionId, userId);

            return true;
        }
    }
}
