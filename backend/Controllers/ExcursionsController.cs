using AutoMapper;
using backend.Data;
using backend.Models.DTO;
using backend.Repositories;
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

        public ExcursionsController(ExcursionDbContext excursionDbContext, IExcursionRepository excursionRepository, IMapper mapper)
        {
            this.excursionDbContext = excursionDbContext;
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "User")]
        public async Task<IActionResult> GetAll()
        {
            var excursions = await excursionRepository.GetAllAsync();
            return Ok(mapper.Map<List<ExcursionDTO>>(excursions));

        }
    }
}
