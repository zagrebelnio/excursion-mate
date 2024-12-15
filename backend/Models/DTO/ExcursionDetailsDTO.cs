using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTO
{
    public class ExcursionDetailsDTO
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
        public string? Photo { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public bool IsFavorite { get; set; }
        public string? Reaction { get; set; }
    }
}
