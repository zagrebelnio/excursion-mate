using AutoMapper;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService recommendationService;

        public RecommendationController(IRecommendationService recommendationService)
        {
            this.recommendationService = recommendationService;
        }

        private string? GetUserId() => HttpContext.Items["UserId"]?.ToString();

        /// <summary>
        /// Retrieves a recommendation for the authenticated user.
        /// </summary>
        [HttpGet("recommendation")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetRecommendations()
        {
            var userId = GetUserId();
            var recommendation = await recommendationService.GetSingleRecommendationAsync(userId);
            if (recommendation == null) return NotFound(new { message = "No recommendations available. " });
            return Ok(recommendation);
        }
    }
}
