using Microsoft.AspNetCore.Identity;

namespace backend.Seed
{
    public class RoleSeedData
    {
        public static List<IdentityRole> GetRoles()
        {
            var adminRoleId = "6D1C8497-771C-4AB7-BDCE-9A321A3C8B08";
            var userRoleId = "3F430AA6-D696-4CCD-BD44-F33B5DC1FC1D";

            return new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = adminRoleId,
                    ConcurrencyStamp = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "Admin".ToUpper()
                },
                new IdentityRole
                {
                    Id = userRoleId,
                    ConcurrencyStamp = userRoleId,
                    Name = "User",
                    NormalizedName = "User".ToUpper()
                }
            };
        }
    }
}
