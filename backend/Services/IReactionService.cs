using backend.Models.DTO;

namespace backend.Services
{
    public interface IReactionService
    {
        Task<bool> ReactToExcursionAsync(string userId, ExcursionReactionDTO reactionDto);
    }
}
