using backend.Models.Domain;
using backend.Validation;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTO
{
    public class AddExcursionDTO
    {

        [Required]
        [MinLength(10, ErrorMessage = "Title must be at least 10 characters")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string Title { get; set; }

        [Required]
        [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
        [StringLength(200, ErrorMessage = "Description cannot exceed 200 characters")]
        public string Description { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "City cannot exceed 30 characters")]
        public string City { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Location cannot exceed 50 characters")]
        public string Location { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        [Required]
        [Range(0, 5000, ErrorMessage = "Price must be between 0 and 1000.")]
        public int Price { get; set; }

        [Required]
        [Range(2, 20, ErrorMessage = "MaxParticipants must be between 2 and 20.")]
        public int MaxParticipants { get; set; }

        [Required]
        [MaxFileSize(5 * 1024 * 1024)] // 5 MB
        [AllowedExtensions(new[] { ".ipg", ".jpeg", ".png"})]
        public IFormFile Photo { get; set; }
    }
}
