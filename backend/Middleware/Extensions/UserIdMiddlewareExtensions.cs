namespace backend.Middleware.Extensions
{
    public static class UserIdMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserId(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<UserIdMiddleware>();
        }
    }
}
