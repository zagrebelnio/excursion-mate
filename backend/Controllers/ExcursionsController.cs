using AutoMapper;
using backend.Data;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Repositories;
using backend.Services;
using backend.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        //[Authorize(AuthenticationSchemes = "Bearer", Roles = "User")]
        public async Task<IActionResult> GetAll([FromQuery] string? title, [FromQuery] string? city, [FromQuery] int? minPrice, [FromQuery] int? maxPrice, [FromQuery] DateTime? date, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
        {
            var excursions = await excursionRepository.GetAllAsync(title, city, minPrice, maxPrice, date, page, pageSize);
            return Ok(mapper.Map<List<ExcursionDTO>>(excursions));

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
        /// Creates a new excursion. Requires authentication.
        /// </summary>
        [HttpPost]
        [ValidateModel]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Create([FromForm] AddExcursionDTO addExcursionDTO)
        {
            var excursion = mapper.Map<Excursion>(addExcursionDTO);

            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ") ? authHeader["Bearer ".Length..].Trim() : string.Empty;
            var userId = tokenService.GetUserIdFromToken(token);

            excursion.UserId = userId;
            excursion.Status = "Active";

            if (addExcursionDTO.Photo != null)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var extension = Path.GetExtension(addExcursionDTO.Photo.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(($"File extension is not allowed. Allowed extensions: {string.Join(", ", allowedExtensions)}"));
                }

                if (addExcursionDTO.Photo.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size exceeds 5 MB.");
                }
                using (var memoryStream = new MemoryStream())
                {
                    await addExcursionDTO.Photo.CopyToAsync(memoryStream);
                    excursion.Photo = memoryStream.ToArray();
                }
            }

            excursion = await excursionRepository.CreateAsync(excursion);
            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(excursion);
            return RedirectToAction("Details", new { id = excursionDTO.Id });
        }


        /// <summary>
        /// Delete an excursion by ID. Requires authentication.
        /// </summary>
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var excursion = await excursionRepository.DeleteAsync(id);
            if (excursion == null) return NotFound();

            return NoContent();
        }
    }
}
