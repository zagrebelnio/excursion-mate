using backend.Models.DTO;

namespace backend.Services
{
    public interface IAdminService
    {
        Task<List<UserWithRoleDTO>> GetAllNonAdminUsersAsync(string? name, string? surname, string? role, int page, int pageSize);
        Task<string> UpdateUserRoleAsync(string userId, string newRole);
    }
}
