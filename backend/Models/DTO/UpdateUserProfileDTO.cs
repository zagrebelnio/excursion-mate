namespace backend.Models.DTO
{
    public class UpdateUserProfileDTO
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public IFormFile? Photo { get; set; }
    }
}
