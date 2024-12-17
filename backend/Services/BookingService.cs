
using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository bookingRepository;
        private readonly IFavoriteExcursionRepository favoriteExcursion;
        private readonly IExcursionRepository excursionRepository;
        private readonly IMapper mapper;

        public BookingService(IBookingRepository bookingRepository, IFavoriteExcursionRepository favoriteExcursion, IExcursionRepository excursionRepository, IMapper mapper)
        {
            this.bookingRepository = bookingRepository;
            this.favoriteExcursion = favoriteExcursion;
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
        }

        public async Task<List<ExcursionDTO>> GetUserRegisteredExcursionsAsync(string userId)
        {
            var excursions = await bookingRepository.GetUserRegisteredExcursionsAsync(userId);
            var excursionDTOs = mapper.Map<List<ExcursionDTO>>(excursions);

            foreach (var excursionDTO  in excursionDTOs)
            {
                if (!string.IsNullOrEmpty(userId))
                {
                    excursionDTO.IsFavorite = await favoriteExcursion.IsFavoriteAsync(userId, excursionDTO.Id);
                    excursionDTO.Reaction = await excursionRepository.GetReactionAsync(userId, excursionDTO.Id);
                }
            }
            return excursionDTOs;
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

        public async Task<bool> UnregisterUserFromExcursionAsync(int excursionId, string userId)
        {
            var success = await bookingRepository.UnregisterUserFromExcursionAsync(excursionId, userId);
            if (!success) throw new KeyNotFoundException("User is not registered for this excursion or excursion does not exist.");
            return true;
        }
    }
}
