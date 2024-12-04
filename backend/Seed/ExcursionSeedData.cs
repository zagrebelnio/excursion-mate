using backend.Models.Domain;

namespace backend.Seed
{
    public static class ExcursionSeedData
    {
        public static List<Excursion> GetExcursions()
        {
            return new List<Excursion>
        {
            new Excursion
            {
                Id = 1,
                Title = "Екскурсія по Львову",
                Description = "Історична екскурсія по центру Львова.",
                City = "Львів",
                Location = "Площа Ринок",
                Date = new DateTime(2024, 12, 15),
                Price = 200.0m,
                MaxParticipants = 20,
                CurrentParticipants = 0,
                ImageUrl = "https://f.discover.ua/location/709/3vk91.jpg",
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UserId = 1
            },
            new Excursion
            {
                Id = 2,
                Title = "Тур на гору Говерла",
                Description = "Одноденний похід на найвищу вершину України.",
                City = "Івано-Франківськ",
                Location = "Говерла",
                Date = new DateTime(2024, 12, 20),
                Price = 500.0m,
                MaxParticipants = 15,
                CurrentParticipants = 0,
                ImageUrl = "https://karpatium.com.ua/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBa0VIIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--672de41986b3eb3547d1cf8a50a6ac8ae4b3d4ba/%D0%B3%D0%BE%D0%B2%D0%B5%D1%80%D0%BB%D0%B0-%D0%B3%D0%BE%D1%80%D0%B0.jpeg?disposition=attachment",
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UserId = 2
            }
        };
        }
    }
}
