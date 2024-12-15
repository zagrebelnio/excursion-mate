using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private readonly IReactionService reactionService;

        public ReactionController(IReactionService reactionService)
        {
            this.reactionService = reactionService;
        }

        private string? GetUserId() => HttpContext.Items["UserId"]?.ToString();

        /// <summary>
        /// Allows a user to react to an excursion (like or dislike).
        /// </summary>
        [HttpPost("react")]
        public async Task<IActionResult> ReactToExcursion([FromBody] ExcursionReactionDTO reactionDTO)
        {
            var userId = GetUserId();

            try
            {
                var result = await reactionService.ReactToExcursionAsync(userId, reactionDTO);
                if (result) return Ok();
                return BadRequest(new { message = "Failed to update reaction" });
            } catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }
    }
}
