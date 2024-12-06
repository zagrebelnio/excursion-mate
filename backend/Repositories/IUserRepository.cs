using backend.Models.Domain;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string userId);
    }
}
