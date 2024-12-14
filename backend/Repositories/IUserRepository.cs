using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string userId);
        Task UpdateUserProfileAsync(User user, UpdateUserProfileDTO updateDto);
        Task<List<(User user, string role)>> GetUsersByRoleAsync(string roleName);
    }
}
