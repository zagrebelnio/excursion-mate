using System.ComponentModel.DataAnnotations;

namespace backend.Validation
{
    public class MaxFileSizeAttribute : ValidationAttribute
    {
        
        private readonly int maxFileSizeInBytes;

        public MaxFileSizeAttribute(int maxFileSizeInBytes)
        {
            this.maxFileSizeInBytes = maxFileSizeInBytes;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is FormFile file && file.Length > maxFileSizeInBytes)
            {
                return new ValidationResult($"File size cannot exceed {maxFileSizeInBytes / 1024 / 1024} MB");
            }

            return ValidationResult.Success;
        }
    }
}
