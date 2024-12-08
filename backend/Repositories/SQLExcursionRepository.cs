using backend.Data;
using backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SQLExcursionRepository : IExcursionRepository
    {

        private readonly ExcursionDbContext excursionDbContext;

        public SQLExcursionRepository(ExcursionDbContext excursionDbContext)
        {
            this.excursionDbContext = excursionDbContext;
        }

        public async Task<Excursion> CreateAsync(Excursion excursion)
        {
            await excursionDbContext.Excursions.AddAsync(excursion);
            await excursionDbContext.SaveChangesAsync();
            return excursion;
        }

        public async Task<Excursion?> DeleteAsync(int id)
        {
            var excursion = await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
            if (excursion == null) return null;

            excursionDbContext.Excursions.Remove(excursion);
            await excursionDbContext.SaveChangesAsync();
            return excursion;
        }

        public async Task<List<Excursion>> GetAllAsync(string? title, string? city, int? minPrice, int? maxPrice, DateTime? date, int page = 1, int pageSize = 9)
        {
            var query = excursionDbContext.Excursions.AsQueryable();

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(e => e.Title.Contains(title));
            }

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(e => e.City.Contains(city));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(e => e.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(e => e.Price <= maxPrice.Value);
            }

            if (date.HasValue)
            {
                query = query.Where(e => e.Date.Date == date.Value.Date);
            }

            var skipResults = (page - 1) * pageSize;


            return await query.Skip(skipResults).Take(pageSize).ToListAsync();
        }

        public async Task<Excursion?> GetByIdAsync(int id)
        {
            return await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
