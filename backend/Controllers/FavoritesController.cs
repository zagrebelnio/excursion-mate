using AutoMapper;
using Azure.Core.Pipeline;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteExcursionRepository favoriteExcursion;
        private readonly IMapper mapper;
        private readonly ITokenService tokenService;

        public FavoritesController(IFavoriteExcursionRepository favoriteExcursion, IMapper mapper, ITokenService tokenService)
        {
            this.favoriteExcursion = favoriteExcursion;
            this.mapper = mapper;
            this.tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromRoute] int excursionId)
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            await favoriteExcursion.AddAsync(userId, excursionId);
            return Ok(new { Message = "Excursion added to favorites" });
        }

        [HttpDelete]
        [Route("{excursionId:int}")]
        public async Task<IActionResult> Remove([FromRoute]int excursionId)
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            await favoriteExcursion.RemoveAsync(userId, excursionId);
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            var favorites = await favoriteExcursion.GetAllAsync(userId);
            var favoritesDto = mapper.Map<List<FavoriteExcursionDTO>>(favorites);

            return Ok(favoritesDto);
        }
        

    }
}
