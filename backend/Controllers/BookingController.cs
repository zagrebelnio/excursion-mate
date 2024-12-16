using backend.Services;
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

        [HttpPost("{id:int}/register")]
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

        [HttpGet("user-registrations")]
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

        [HttpDelete("unregister/{excursionId:int}")]
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
