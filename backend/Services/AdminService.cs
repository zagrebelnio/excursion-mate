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

        public async Task<List<UserWithRoleDTO>> GetAllNonAdminUsersAsync()
        {
            var usersWithRoles = await userRepository.GetAllNonAdminUsersAsync();
            var result = new List<UserWithRoleDTO>();

            foreach (var (user, role) in usersWithRoles)
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
