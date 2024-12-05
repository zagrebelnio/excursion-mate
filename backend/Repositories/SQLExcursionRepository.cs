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

        public async Task<List<Excursion>> GetAllAsync()
        {
            return await excursionDbContext.Excursions.ToListAsync();
        }
    }
}
