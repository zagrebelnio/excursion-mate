using backend.Models.Domain;

namespace backend.Seed
{
    public class UserSeedData
    {
        public static List<User> GetUsers()
        {
            return new List<User>
            {
                new User
                {
                    UserName = "admin@example.com",
                    Email = "admin@example.com",
                    FirstName = "Stepan",
                    LastName = "Tarasov",
                    PhotoUrl = "https://insider.ua/wp-content/uploads/2024/10/jaison-steitem.jpg",
                    EmailConfirmed = true
                },
                new User
                {
                    UserName = "user@example.com",
                    Email = "user@example.com",
                    FirstName = "Roman",
                    LastName = "Piznak",
                    PhotoUrl = "https://drohobychchyna.com.ua/wp-content/uploads/2022/08/7-2.jpeg",
                    EmailConfirmed = true
                }
            };
        }
    }
}
