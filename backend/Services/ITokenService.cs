namespace backend.Services
{
    public interface ITokenService
    {
        string GetUserIdFromToken(string token);
    }
}
