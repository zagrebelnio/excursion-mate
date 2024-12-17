using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService bookingService;

        public BookingController(IBookingService bookingService)
        {
            this.bookingService = bookingService;
        }

        private string? GetUserId() => HttpContext.Items["UserId"]?.ToString();


        /// <summary>
        /// Registers the authenticated user for the specified excursion.
        /// </summary>
        [HttpPost("{id:int}/register")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RegisterForExcursion(int id)
        {
            var userId = GetUserId();
            try
            {
                var success = await bookingService.RegisterUserForExcursionAsync(id, userId);
                if (success) return Ok(new { message = "You have been successfully registered for the excursion." });
                return BadRequest("Unable to register for excursion");
            }
            catch (KeyNotFoundException)
            {

                return NotFound("Excursion not found.");
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }


        /// <summary>
        /// Retrieves all excursions that the authenticated user is registered for.
        /// </summary>
        [HttpGet("user-registrations")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetUserRegisteredExcursions()
        {
            var userId = GetUserId();

            try
            {
                var excursions = await bookingService.GetUserRegisteredExcursionsAsync(userId);
                if (excursions == null || excursions.Count == 0) return NotFound("No excursions found.");
                return Ok(excursions);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Unregisters the authenticated user from a specific excursion.
        /// </summary>
        [HttpDelete("unregister/{excursionId:int}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UnregisterFromExcursion(int excursionId)
        {
            var userId = GetUserId();
            
            try
            {
                var result = await bookingService.UnregisterUserFromExcursionAsync(excursionId, userId);
                if (result) return Ok("Successfully unregistered from the excursion");
                else return NotFound("User is not registered for this excursion.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
