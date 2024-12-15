namespace backend.Models.Domain
{
    public class ExcursionReaction
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public int ExcursionId { get; set; }
        public Excursion Excursion { get; set; }

        public ReactionType ReactionType { get; set; }
        public DateTime ReactionDate { get; set; } = DateTime.Now;
    }

    public enum ReactionType
    {
        Like = 1,
        Dislike = -1
    }
}
