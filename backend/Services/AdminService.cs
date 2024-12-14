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

        public async Task<List<UserWithRoleDTO>> GetUsersWithRoleAsync(string roleName)
        {
            var usersWithRoles = await userRepository.GetUsersByRoleAsync(roleName);
            var result = new List<UserWithRoleDTO>();

            foreach (var (user, role) in usersWithRoles)
            {
                var userDto = mapper.Map<UserWithRoleDTO>(user);
                userDto.Role = role;
                result.Add(userDto);
            }

            return result;
        }
    }
}
