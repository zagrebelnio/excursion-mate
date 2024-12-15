namespace backend.Repositories
{
    public interface IReactionRepository
    {
        Task<bool> UpdateReactionAsync(string userId, int excursionId, string reaction);
    }
}
