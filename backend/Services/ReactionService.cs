using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class ReactionService : IReactionService
    {
        private readonly IReactionRepository reactionRepository;

        public ReactionService(IReactionRepository reactionRepository)
        {
            this.reactionRepository = reactionRepository;
        }

        public async Task<bool> ReactToExcursionAsync(string userId, ExcursionReactionDTO reactionDto)
        {
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException("User is not authenticated");
            if (reactionDto.Reaction != "Like" && reactionDto.Reaction != "Dislike") throw new ArgumentException("Invalid reaction type");
            
            return await reactionRepository.UpdateReactionAsync(userId, reactionDto.ExcursionId, reactionDto.Reaction);
        }
    }
}
