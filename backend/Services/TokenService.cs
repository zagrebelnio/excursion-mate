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
    }
}
