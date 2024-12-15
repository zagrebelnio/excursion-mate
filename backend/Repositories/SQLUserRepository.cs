using backend.Data;
using backend.Models.Domain;
using backend.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SQLUserRepository : IUserRepository
    {

        private readonly ExcursionDbContext excursionDbContext;
        private readonly UserManager<User> userManager;

        public SQLUserRepository(ExcursionDbContext excursionDbContext, UserManager<User> userManager)
        {
            this.excursionDbContext = excursionDbContext;
            this.userManager = userManager;
        }

        public async Task<string> ChangeUserRoleAsync(string userId, string newRole)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return "User not found";

            var currentRole = (await userManager.GetRolesAsync(user)).FirstOrDefault();
            if (currentRole == newRole) return newRole == "Banned" ? "Already banned" : "Already User";
            if (!string.IsNullOrEmpty(currentRole))
            {
                var removeRolesResult = await userManager.RemoveFromRoleAsync(user, currentRole);
                if (!removeRolesResult.Succeeded) return "Role changed failed";
            }

            var addRoleResult = await userManager.AddToRoleAsync(user, newRole);
            if (!addRoleResult.Succeeded) return "Role changed failed";

            return "Success";
            
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await excursionDbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<(User user, string role)>> GetAllNonAdminUsersAsync()
        {
            var users = await userManager.Users.ToListAsync();
            var result = new List<(User, string)>();

            foreach (var user in users)
            {
                var role = (await userManager.GetRolesAsync(user)).FirstOrDefault();
                if (role != null && role != "Admin")
                {
                    result.Add((user, role));
                }
            }

            return result;
        }

        public async Task UpdateUserProfileAsync(User user, UpdateUserProfileDTO updateDto)
        {
            if (updateDto.FirstName != null) user.FirstName = updateDto.FirstName;
            if (updateDto.LastName != null) user.LastName = updateDto.LastName;
            if (updateDto.Photo != null)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var extension = Path.GetExtension(updateDto.Photo.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    throw new ArgumentException("Invalid file type. Allowed types are: .jpg, .jpeg, .png, .gif");
                }

                const long maxFileSize = 5 * 1024 * 1024; 
                if (updateDto.Photo.Length > maxFileSize)
                {
                    throw new ArgumentException("File size exceeds 5 MB.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await updateDto.Photo.CopyToAsync(memoryStream);
                    user.Photo = memoryStream.ToArray();
                }
            }

            excursionDbContext.Users.Update(user);
            await excursionDbContext.SaveChangesAsync();
        }
    }
}
