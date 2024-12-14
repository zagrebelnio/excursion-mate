using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Validation
{
    internal class ExcursionOwnerAuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly IExcursionRepository excursionRepository;
        private readonly ITokenService tokenService;

        public ExcursionOwnerAuthorizationFilter(IExcursionRepository excursionRepository, ITokenService tokenService)
        {
            this.excursionRepository = excursionRepository;
            this.tokenService = tokenService;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var authHeader = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Authorization header is missing or invalid." });
                return;
            }

            var token = authHeader.Substring("Bearer ".Length);

            if (!context.RouteData.Values.TryGetValue("id", out var routeValue))
            {
                context.Result = new BadRequestObjectResult(new { message = "Excursion ID is missing in the route." });
                return;
            }

            if (!int.TryParse(routeValue.ToString(), out int excursionId))
            {
                context.Result = new BadRequestObjectResult(new { message = "Excursion ID is invalid." });
                return;
            }

            var userId = tokenService.GetUserIdFromToken(token);
            var userRole = tokenService.GetUserRoleFromToken(token);

            if (userRole == "Admin") return;

            var isOwner = await excursionRepository.IsUserOwnerAsync(excursionId, userId);

            if (!isOwner)
            {
                context.Result = new ObjectResult(new { message = "You are not the owner of this excursion." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
}