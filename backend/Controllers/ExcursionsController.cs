using AutoMapper;
using backend.Data;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using backend.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sprache;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcursionsController : ControllerBase
    {
        private readonly ExcursionDbContext excursionDbContext;
        private readonly IExcursionRepository excursionRepository;
        private readonly IMapper mapper;
        private readonly ITokenService tokenService;

        public ExcursionsController(ExcursionDbContext excursionDbContext, IExcursionRepository excursionRepository, IMapper mapper, ITokenService tokenService)
        {
            this.excursionDbContext = excursionDbContext;
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
            this.tokenService = tokenService;
        }

        /// <summary>
        /// Retrieves a list of all available excursions with optional filters (title, city, price, date)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? title, [FromQuery] string? city, [FromQuery] int? minPrice, [FromQuery] int? maxPrice, [FromQuery] DateTime? date, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
        {
            var excursions = await excursionRepository.GetAllAsync(title, city, minPrice, maxPrice, date, page, pageSize);
            var totalPages = (int)Math.Ceiling((double)excursions.TotalCount / pageSize);

            var response = mapper.Map<PagedResponse<ExcursionDTO>>(excursions);
            response.TotalPages = totalPages;
            response.CurrentPage = page;
            response.PageSize = pageSize;
            return Ok(response);
        }


        /// <summary>
        /// Retrieves details of a specific excursion by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Details(int id)
        {
            var excursion = await excursionRepository.GetByIdAsync(id);
            if (excursion == null) return NotFound();

            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(excursion);

            if (excursion.Photo != null)
            {
                excursionDTO.Photo = Convert.ToBase64String(excursion.Photo);
            }

            return Ok(excursionDTO);
        }


        /// <summary>
        /// Creates a new excursion. Requires authentication
        /// </summary>
        [HttpPost]
        [ValidateModel]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Create([FromForm] AddExcursionDTO addExcursionDTO)
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            var excursion = await excursionRepository.CreateAsync(addExcursionDTO, userId);
            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(excursion);
            return RedirectToAction("Details", new { id = excursionDTO.Id });
        }


        /// <summary>
        /// Delete an excursion by ID. Requires authentication
        /// </summary>
        [HttpDelete]
        [Route("{id:int}")]
        [ExcursionOwnerAuthorization]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var excursion = await excursionRepository.DeleteAsync(id);
            if (excursion == null) return NotFound();

            return NoContent();
        }


        /// <summary>
        /// Update an existing excursion. Requires authentication
        /// </summary>
        [HttpPatch]
        [Route("{id:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [ExcursionOwnerAuthorization]
        [ValidateModel]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromForm] EditExcursionDTO editExcursionDTO)
        {
            var editedExcursion = await excursionRepository.UpdateAsync(id, editExcursionDTO);
            if (editedExcursion == null) return NotFound();
            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(editedExcursion);

            if (editedExcursion.Photo != null)
            {
                excursionDTO.Photo = Convert.ToBase64String(editedExcursion.Photo);
            }
            return Ok(excursionDTO);
        }


        /// <summary>
        /// Retrieves a list of excursions for the currently authenticated user
        /// </summary>
        [HttpGet]
        [Route("user-excursions")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetUserExcursions()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            if (userId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var excursions = await excursionRepository.GetByUserIdAsync(userId);
            return Ok(mapper.Map<List<ExcursionDTO>>(excursions));
        }
    }
}
