using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly ITokenRepository tokenRepository;

        public AuthController(UserManager<User> userManager, ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
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
    }
}
