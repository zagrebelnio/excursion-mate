using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.Facebook;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IConfiguration configuration;

        public AuthController(UserManager<User> userManager, ITokenRepository tokenRepository, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.configuration = configuration;
        }

        // POST: api/Auth/Register
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            var existingUserByEmail = await userManager.FindByEmailAsync(registerRequestDTO.Username);
            if (existingUserByEmail != null)
            {
                return BadRequest("User with this email already exists.");
            }
            var identityUser = new User
            {
                UserName = registerRequestDTO.Username,
                Email = registerRequestDTO.Username,
                FirstName = registerRequestDTO.FirstName,
                LastName = registerRequestDTO.LastName,
                PhotoUrl = null
            };

            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDTO.Password);

            if (identityResult.Succeeded)
            {
                identityResult = await userManager.AddToRoleAsync(identityUser, "User");

                if (identityResult.Succeeded)
                {
                    return Ok("User was registered! Please login.");
                }
            }

            return BadRequest(identityResult.Errors.Select(e => e.Description));
        }


        // POST: /api/Auth/Login
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var user = await userManager.FindByEmailAsync(loginRequestDTO.Username);
            if (user != null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, loginRequestDTO.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(user);
                    if (roles != null && roles.Any())
                    {
                        var iwtToken = tokenRepository.CreateJWTToken(user, roles.ToList());

                        var response = new LoginResponseDTO
                        {
                            JwtToken = iwtToken,
                        };

                        return Ok(response);
                    }
                }
            }

            return BadRequest("Username or password incorrect");
        }

        [HttpGet("LoginWithGoogle")]
        public IActionResult LoginWithGoogle()
        {
            var redirectUrl = Url.Action("GoogleResponse", "Auth", null, Request.Scheme);
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }


        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
            {
                return BadRequest("Google authentication failed.");
            }

            var idToken = authenticateResult.Properties.GetTokenValue("id_token");

            GoogleJsonWebSignature.Payload payload;
            try
            {
                string googleClientId = configuration["Google_ClientId"]; 

                payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                });
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid Google ID token.");
            }

            var googleId = payload.Subject;
            var email = payload.Email;
            var firstName = payload.GivenName;
            var lastName = payload.FamilyName;

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName
                };

                var identityResult = await userManager.CreateAsync(user);
                if (!identityResult.Succeeded)
                {
                    return BadRequest("Failed to create user.");
                }

                await userManager.AddToRoleAsync(user, "User");
            }

            var roles = await userManager.GetRolesAsync(user);
            var jwtToken = tokenRepository.CreateJWTToken(user, roles.ToList());

            var response = new LoginResponseDTO
            {
                JwtToken = jwtToken
            };

            return Ok(response);
        }

        [HttpGet("LoginWithFacebook")]
        public IActionResult LoginWithFacebook()
        {
            var redirectUrl = Url.Action("FacebookResponse", "Auth", null, Request.Scheme);
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("FacebookResponse")]
        public async Task<IActionResult> FacebookResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(FacebookDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
            {
                return BadRequest("Facebook authentication failed.");
            }

            var accessToken = authenticateResult.Properties.GetTokenValue("access_token");

            var facebookUserInfo = await GetFacebookUserInfo(accessToken);

            if (facebookUserInfo == null)
            {
                return BadRequest("Failed to get Facebook user info.");
            }

            var facebookId = facebookUserInfo.id;
            var email = facebookUserInfo.email;
            var firstName = facebookUserInfo.first_name;
            var lastName = facebookUserInfo.last_name;

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    PhotoUrl = facebookUserInfo.picture?.data?.url 
                };

                var identityResult = await userManager.CreateAsync(user);
                if (!identityResult.Succeeded)
                {
                    return BadRequest("Failed to create user.");
                }

                await userManager.AddToRoleAsync(user, "User");
            }

            var roles = await userManager.GetRolesAsync(user);
            var jwtToken = tokenRepository.CreateJWTToken(user, roles.ToList());

            var response = new LoginResponseDTO
            {
                JwtToken = jwtToken
            };

            return Ok(response);
        }

        private async Task<dynamic> GetFacebookUserInfo(string accessToken)
        {
            using var httpClient = new HttpClient();
            var requestUri = $"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={accessToken}";
            var response = await httpClient.GetStringAsync(requestUri);

            try
            {
                return JsonSerializer.Deserialize<dynamic>(response);
            }
            catch
            {
                return null;
            }
        }

    }
}
