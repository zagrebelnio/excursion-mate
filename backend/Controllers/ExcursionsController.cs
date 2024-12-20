﻿using AutoMapper;
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
        private readonly IExcursionRepository excursionRepository;
        private readonly IMapper mapper;
        private readonly IExcursionService excursionService;
        private readonly IWeatherService weatherService;
        private readonly IViewedExcursionService viewedExcursionService;

        public ExcursionsController(IExcursionRepository excursionRepository, IMapper mapper, IExcursionService excursionService, IWeatherService weatherService, IViewedExcursionService viewedExcursionService)
        {
            this.excursionRepository = excursionRepository;
            this.mapper = mapper;
            this.excursionService = excursionService;
            this.weatherService = weatherService;
            this.viewedExcursionService = viewedExcursionService;
        }
        private string? GetUserId() => HttpContext.Items["UserId"]?.ToString();

        /// <summary>
        /// Retrieves a list of all available excursions with optional filters (title, city, price, date)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? title, [FromQuery] string? city, [FromQuery] int? minPrice, [FromQuery] int? maxPrice, [FromQuery] DateTime? date, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
        {
            var userId = GetUserId();
            var response = await excursionService.GetPagedExcursionsAsync(userId, title, city, minPrice, maxPrice, date, page, pageSize);
            return Ok(response);
        }


        /// <summary>
        /// Retrieves details of a specific excursion with weather forecast by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Details(int id)
        {
            var userId = GetUserId();
            var excursionDTO = await excursionService.GetExcursionDetailsAsync(id, userId);
            if (excursionDTO == null) return NotFound();

            var weather = await weatherService.GetWeatherForecastAsync(excursionDTO.City, excursionDTO.Date);
            if (weather != null) excursionDTO.Weather = weather;

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
            var userId = GetUserId();
            var excursion = await excursionRepository.CreateAsync(addExcursionDTO, userId);
            var excursionDTO = mapper.Map<ExcursionDetailsDTO>(excursion);
            return Ok(excursionDTO);
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
            await excursionRepository.DeleteAsync(id);
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
            var userId = GetUserId();
            var excursions = await excursionRepository.GetByUserIdAsync(userId);
            return Ok(mapper.Map<List<ExcursionDTO>>(excursions));
        }

        /// <summary>
        /// Marks an excursion as viewed by the user
        /// </summary>
        [HttpPost]
        [Route("viewed")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> MarkAsViewed([FromBody] AddViewedExcursionDTO addViewedExcursionDTO)
        {
            var userId = GetUserId();
            await viewedExcursionService.MarkAsViewedAsync(userId, addViewedExcursionDTO);
            return Ok();
        }
    }
}
