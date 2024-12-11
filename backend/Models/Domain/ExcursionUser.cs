namespace backend.Models.Domain
{
    public class ExcursionUser
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public int ExcursionId { get; set; }
        public Excursion Excursion { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;
    }
}
