﻿namespace backend.Models.DTO
{
    public class FavoriteExcursionDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public DateTime Date { get; set; }
        public int Price { get; set; }
        public string? Photo { get; set; }
        public int? Likes { get; set; }
        public int? Dislikes { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
    }
}
