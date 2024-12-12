namespace backend.Models.DTO
{
    public class LoginResponseDTO
    {
        public string JwtToken { get; set; }
        public string Role {  get; set; }
    }
}
