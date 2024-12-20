using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalAuthController : ControllerBase
    {
        private readonly IExternalAuthService externalAuthService;

        public ExternalAuthController(IExternalAuthService externalAuthService)
        {
            this.externalAuthService = externalAuthService;
        }

        /// <summary>
        /// Initiates the Google authentication process by redirecting the user to Google's authentication page.
        /// </summary>
        [HttpGet("google-login")]
        public async Task Login()
        {
            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

        /// <summary>
        /// Handles the Google authentication response and retrieves the authenticated user's details, including a JWT token.
        /// </summary>
        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (result?.Principal?.Identities?.FirstOrDefault() == null) return Unauthorized("User is not authenticated.");

            try
            {
                var response = await externalAuthService.AuthenticateWithGoogleAsync(result.Principal);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
