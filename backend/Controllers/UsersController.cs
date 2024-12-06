using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is missing.");
            }

            var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token.");
            }

            var user = await userRepository.GetUserByIdAsync((userId));

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userProfile = mapper.Map<UserProfileDTO>(user);

            return Ok(userProfile);
        }
    }
}
