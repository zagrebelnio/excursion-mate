using backend.Models.Domain;

namespace backend.Models.Domain
{
    public class ViewedExcursion
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public int ExcursionId { get; set; }
        public Excursion Excursion { get; set; }
        public DateTime ViewedAt { get; set; } = DateTime.Now;
    }
}