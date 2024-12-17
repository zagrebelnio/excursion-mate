namespace backend.Models.DTO
{
    public class ExcursionUserDTO
    {
        public int ExcursionId { get; set; }
        public int UserId { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
    }
}
