namespace backend.Services
{
    public interface ITokenService
    {
        string GetUserIdFromToken(string token);
        string GetUserRoleFromToken(string token);
    }
}
