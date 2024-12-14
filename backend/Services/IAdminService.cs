using backend.Models.DTO;

namespace backend.Services
{
    public interface IAdminService
    {
        Task<List<UserWithRoleDTO>> GetUsersWithRoleAsync(string roleName);
    }
}
