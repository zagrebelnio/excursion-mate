using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public AdminService(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<List<UserWithRoleDTO>> GetAllNonAdminUsersAsync(string? name, string? surname, string? role, int page, int pageSize)
        {
            var usersWithRoles = await userRepository.GetAllNonAdminUsersAsync();

            if (!string.IsNullOrEmpty(name))
            {
                usersWithRoles = usersWithRoles.Where(u => u.user.FirstName.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrEmpty(surname))
            {
                usersWithRoles = usersWithRoles.Where(u => u.user.LastName.Contains(surname, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrEmpty(role))
            {
                usersWithRoles = usersWithRoles.Where(u => u.role.Equals(role, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            var pagedUsers = usersWithRoles.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var result = new List<UserWithRoleDTO>();

            foreach (var (user, userRole) in pagedUsers)
            {
                var userDto = mapper.Map<UserWithRoleDTO>(user);
                userDto.Role = role ?? "NoRole";
                result.Add(userDto);
            }

            return result;
        }

        public async Task<string> UpdateUserRoleAsync(string userId, string newRole)
        {
            if (newRole != "User" && newRole != "Banned") throw new ArgumentException("Invalid role");
            return await userRepository.ChangeUserRoleAsync(userId, newRole);
        }
    }
}
