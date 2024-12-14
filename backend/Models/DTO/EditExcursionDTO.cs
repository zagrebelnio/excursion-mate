using backend.Validation;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTO
{
    public class EditExcursionDTO
    {
        [MinLength(10, ErrorMessage = "Title must be at least 10 characters")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string? Title { get; set; }

        [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
        [StringLength(200, ErrorMessage = "Description cannot exceed 200 characters")]
        public string? Description { get; set; }

        [StringLength(30, ErrorMessage = "City cannot exceed 30 characters")]
        public string? City { get; set; }

        [StringLength(50, ErrorMessage = "Location cannot exceed 50 characters")]
        public string? Location { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? Date { get; set; }

        [Range(0, 1000, ErrorMessage = "Price must be between 0 and 1000.")]
        public int? Price { get; set; }

        [Range(5, 30, ErrorMessage = "MaxParticipants must be between 5 and 30.")]
        public int? MaxParticipants { get; set; }

        [MaxFileSize(5 * 1024 * 1024)] 
        [AllowedExtensions(new[] { ".jpg", ".jpeg", ".png" })]
        public IFormFile? Photo { get; set; }
    }
}
