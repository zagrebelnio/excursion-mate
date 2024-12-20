using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace backend.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        private readonly UserManager<User> userManager;
        private readonly ITokenRepository tokenRepository;

        public ExternalAuthService(UserManager<User> userManager, ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
        }
        public async Task<LoginResponseDTO> AuthenticateWithGoogleAsync(ClaimsPrincipal principal)
        {
            var claims = principal.Identities.FirstOrDefault()?.Claims;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var fullName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    FirstName = fullName?.Split(' ').FirstOrDefault(),
                    LastName = fullName?.Split(' ').LastOrDefault(),
                };

                var identityResult = await userManager.CreateAsync(user);

                if (!identityResult.Succeeded)
                {
                    throw new Exception("Failed to create user.");
                }

                await userManager.AddToRoleAsync(user, "User");
            }

            var roles = await userManager.GetRolesAsync(user);
            var jwtToken = tokenRepository.CreateJWTToken(user, roles.ToList());

            var role = roles.FirstOrDefault();
            return new LoginResponseDTO
            {
                JwtToken = jwtToken,
                Role = role
            };
        }
    }
}
