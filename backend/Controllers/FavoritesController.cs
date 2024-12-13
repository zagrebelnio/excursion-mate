using AutoMapper;
using Azure.Core.Pipeline;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteExcursionRepository favoriteExcursion;
        private readonly IMapper mapper;
        private readonly ITokenService tokenService;
        private readonly IFavoriteExcursionService favoriteExcursionService;

        public FavoritesController(IFavoriteExcursionRepository favoriteExcursion, IMapper mapper, ITokenService tokenService, IFavoriteExcursionService favoriteExcursionService)
        {
            this.favoriteExcursion = favoriteExcursion;
            this.mapper = mapper;
            this.tokenService = tokenService;
            this.favoriteExcursionService = favoriteExcursionService;
        }
        private string? GetUserId() => HttpContext.Items["UserId"]?.ToString();

        /// <summary>
        /// Adds an excursion to the user's favorites.
        /// </summary>
        [HttpPost]
        [Route("{excursionId:int}")]
        public async Task<IActionResult> Add([FromRoute] int excursionId)
        {
            var userId = GetUserId();
            try
            {
                await favoriteExcursionService.AddToFavoritesAsync(userId, excursionId);
                return Ok(new { message = "Excursion added to favorites." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Removes an excursion from the user's favorites.
        /// </summary>
        [HttpDelete]
        [Route("{excursionId:int}")]
        public async Task<IActionResult> Remove([FromRoute]int excursionId)
        {
            var userId = GetUserId();
            await favoriteExcursion.RemoveAsync(userId, excursionId);
            return NoContent();
        }

        /// <summary>
        /// Retrieves a list of all the excursions in the user's favorites.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var favorites = await favoriteExcursion.GetAllAsync(userId);
            var favoritesDto = mapper.Map<List<FavoriteExcursionDTO>>(favorites);
            return Ok(favoritesDto);
        }
    }
}
