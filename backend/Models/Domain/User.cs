using Microsoft.AspNetCore.Identity;

namespace backend.Models.Domain
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[]? Photo { get; set; }
        public ICollection<Excursion>? Excursions { get; set; }

        public ICollection<ExcursionUser> ExcursionUsers { get; set; }
        public ICollection<FavoriteExcursion> FavoriteExcursions { get; set; }
        public ICollection<ExcursionReaction> ExcursionReactions { get; set; }
        public ICollection<ViewedExcursion> ViewedExcursions { get; set; }
    }
}
