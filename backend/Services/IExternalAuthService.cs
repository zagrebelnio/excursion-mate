using backend.Models.DTO;
using System.Security.Claims;

namespace backend.Services
{
    public interface IExternalAuthService
    {
        Task<LoginResponseDTO> AuthenticateWithGoogleAsync(ClaimsPrincipal principal);
    }
}
