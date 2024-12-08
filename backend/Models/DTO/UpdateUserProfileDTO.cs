using backend.Validation;

namespace backend.Models.DTO
{
    public class UpdateUserProfileDTO
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [MaxFileSize(5 * 1024 * 1024)] // 5 MB
        [AllowedExtensions(new[] { ".ipg", ".jpeg", ".png" })]
        public IFormFile? Photo { get; set; }
    }
}
