using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;

        public AdminController(IAdminService adminService)
        {
            this.adminService = adminService;
        }

        /// <summary>
        /// Retrieves a list of non-admin users with optional filters for name, surname, and role. 
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUserWithRole([FromQuery] string? name, [FromQuery] string? surname, [FromQuery] string? role, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            return Ok(await adminService.GetAllNonAdminUsersAsync(name, surname, role, page, pageSize));
        }

        /// <summary>
        /// Bans a user by updating their role to the specified new role.
        /// </summary>
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpPost("ban/{userId}")]
        public async Task<IActionResult> BanUser(string userId, [FromBody] string newRole)
        {
            return Ok(await adminService.UpdateUserRoleAsync(userId, newRole));
        }
    }
}
