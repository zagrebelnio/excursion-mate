using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
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
        private readonly ITokenService tokenService;

        public UsersController(IUserRepository userRepository, IMapper mapper, ITokenService tokenService)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
            this.tokenService = tokenService;
        }

        /// <summary>
        /// Retrieves the profile information of the currently authenticated user (must be authenticated using a Bearer token)
        /// </summary>
        [HttpGet("profile")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetProfile()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;

            if (string.IsNullOrEmpty(token)) return Unauthorized("Token is missing.");
            var userId = tokenService.GetUserIdFromToken(token);
            var user = await userRepository.GetUserByIdAsync((userId));

            if (user == null) return NotFound("User not found.");
            
            var userProfile = mapper.Map<UserProfileDTO>(user);
            if (user.Photo != null)
            {
                userProfile.Photo = Convert.ToBase64String(user.Photo); 
            }

            return Ok(userProfile);
        }

        /// <summary>
        /// Updates the profile information of the currently authenticated user (must be authenticated using a Bearer token)
        /// </summary>
        [HttpPatch("edit")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateUserProfileDTO updateDTO)
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;

            var userId = tokenService.GetUserIdFromToken(token);

            var user = await userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            try
            {
                await userRepository.UpdateUserProfileAsync(user, updateDTO);
                return NoContent();
            }

            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
