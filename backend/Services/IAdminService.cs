using backend.Models.DTO;

namespace backend.Services
{
    public interface IAdminService
    {
        Task<List<UserWithRoleDTO>> GetAllNonAdminUsersAsync();
        Task<string> UpdateUserRoleAsync(string userId, string newRole);
    }
}
