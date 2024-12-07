using AutoMapper;
using backend.Data;
using backend.Models.Domain;
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
        /// Retrieves a list of all available excursions (now requires authentication and role "User")
        /// </summary>
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "User")]
        public async Task<IActionResult> GetAll()
        {
            var excursions = await excursionRepository.GetAllAsync();
            return Ok(mapper.Map<List<ExcursionDTO>>(excursions));

        }

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


        [HttpPost]
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
    }
}
