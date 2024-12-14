using backend.Services;

namespace backend.Middleware
{
    public class UserIdMiddleware
    {
        private readonly RequestDelegate _next;

        public UserIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ITokenService tokenService) // Инжектируем здесь
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader))
            {
                var token = authHeader.StartsWith("Bearer ")
                    ? authHeader["Bearer ".Length..].Trim()
                    : string.Empty;

                var userId = tokenService.GetUserIdFromToken(token);

                if (userId == null)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { message = "Invalid token or user ID not found" });
                    return;
                }

                context.Items["UserId"] = userId;
            }

            await _next(context);
        }
    }
}
