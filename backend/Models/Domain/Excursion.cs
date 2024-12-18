namespace backend.Models.Domain
{
    public class Excursion
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int Price { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public byte[]? Photo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int Likes { get; set; } = 0;
        public int Dislikes { get; set; } = 0;

        public string? UserId { get; set; } 
        public User User { get; set; }

        public ICollection<ExcursionUser> ExcursionUsers { get; set; }
        public ICollection<FavoriteExcursion> FavoriteExcursions { get; set; }
        public ICollection<ExcursionReaction> ExcursionReactions { get; set; }
        public ICollection<ViewedExcursion> ViewedExcursions { get; set; }
    }
}
