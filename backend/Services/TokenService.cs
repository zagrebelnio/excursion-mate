using Azure.Core;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Services
{
    public class TokenService : ITokenService
    {
        public string GetUserIdFromToken(string token)
        {
            var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException("Invalid token");
            return userId;
        }

        public string GetUserRoleFromToken(string token)
        {
            var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            if (string.IsNullOrEmpty(role))
            {
                role = jwtToken.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            }

            if (string.IsNullOrEmpty(role))
            {
                throw new UnauthorizedAccessException("Role claim not found in token");
            }

            return role;
        }
    }
}
