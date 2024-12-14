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

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUserWithRole()
        {
            return Ok(await adminService.GetAllNonAdminUsersAsync());
        }

        [HttpPost("ban/{userId}")]
        public async Task<IActionResult> BanUser(string userId, [FromBody] string newRole)
        {
            return Ok(await adminService.UpdateUserRoleAsync(userId, newRole));
        }
    }
}
