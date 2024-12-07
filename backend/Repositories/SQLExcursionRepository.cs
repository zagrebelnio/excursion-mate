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

        public async Task<List<Excursion>> GetAllAsync()
        {
            return await excursionDbContext.Excursions.ToListAsync();
        }

        public async Task<Excursion?> GetByIdAsync(int id)
        {
            return await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
