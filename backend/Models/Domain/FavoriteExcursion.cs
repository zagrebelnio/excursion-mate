namespace backend.Models.Domain
{
    public class FavoriteExcursion
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public int ExcursionId { get; set; }
        public Excursion Excursion { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.Now;
    }
}
