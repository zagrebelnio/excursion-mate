
using backend.Data;
using backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly ExcursionDbContext excursionDbContext;

        public ReactionRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }

        public async Task<bool> UpdateReactionAsync(string userId, int excursionId, string reaction)
        {
            using var transaction = await excursionDbContext.Database.BeginTransactionAsync();

            try
            {
                var existingReaction = await excursionDbContext.ExcursionReactions
                    .FirstOrDefaultAsync(er => er.UserId == userId && er.ExcursionId == excursionId);

                var excursion = await excursionDbContext.Excursions
                    .FirstOrDefaultAsync(e => e.Id == excursionId);

                if (excursion == null) throw new ArgumentException("Excursion not found");

                if (existingReaction == null)
                {
                    excursionDbContext.ExcursionReactions.Add(new ExcursionReaction
                    {
                        UserId = userId,
                        ExcursionId = excursionId,
                        ReactionType = reaction == "Like" ? ReactionType.Like : ReactionType.Dislike,
                        ReactionDate = DateTime.Now
                    });

                    if (reaction == "Like") excursion.Likes++;
                    else excursion.Dislikes++;
                }
                else if ((reaction == "Like" && existingReaction.ReactionType == ReactionType.Like) ||
                         (reaction == "Dislike" && existingReaction.ReactionType == ReactionType.Dislike))
                {
                    excursionDbContext.ExcursionReactions.Remove(existingReaction);

                    if (existingReaction.ReactionType == ReactionType.Like) excursion.Likes--;
                    else excursion.Dislikes--;
                }
                else
                {
                    if (existingReaction.ReactionType == ReactionType.Like)
                    {
                        excursion.Likes--;
                        excursion.Dislikes++;
                    }
                    else
                    {
                        excursion.Dislikes--;
                        excursion.Likes++;
                    }

                    existingReaction.ReactionType = reaction == "Like" ? ReactionType.Like : ReactionType.Dislike;
                    excursionDbContext.ExcursionReactions.Update(existingReaction);
                }

                await excursionDbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
