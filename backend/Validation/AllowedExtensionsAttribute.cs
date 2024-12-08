using System.ComponentModel.DataAnnotations;

namespace backend.Validation
{
    public class AllowedExtensionsAttribute : ValidationAttribute
    {
        
        private readonly string[] extensions;

        public AllowedExtensionsAttribute(string[] extensions)
        {
            this.extensions = extensions;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is IFormFile file)
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extensions.Contains(extension))
                {
                    return new ValidationResult($"File extension is not allowed. Allowed extensions: {string.Join(", ", extensions)}");
                }
            }

            return ValidationResult.Success;
        }
    }
}
