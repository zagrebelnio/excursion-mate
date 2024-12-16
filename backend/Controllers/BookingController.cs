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
    }
}
