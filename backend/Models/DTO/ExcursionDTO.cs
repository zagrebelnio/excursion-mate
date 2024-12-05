namespace backend.Models.DTO
{
    public class ExcursionDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public string? ImageUrl { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
