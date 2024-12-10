using backend.Data;
using backend.Models.Domain;
using backend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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

        public async Task<Excursion?> UpdateAsync(int id, EditExcursionDTO editExcursionDTO)
        {
            var excursion = await excursionDbContext.Excursions.FindAsync(id);
            if (excursion == null) return null;

            if (!string.IsNullOrEmpty(editExcursionDTO.Title))
            {
                excursion.Title = editExcursionDTO.Title;
            }
            if (!string.IsNullOrEmpty(editExcursionDTO.Description))
            {
                excursion.Description = editExcursionDTO.Description;
            }
            if (!string.IsNullOrEmpty(editExcursionDTO.City))
            {
                excursion.City = editExcursionDTO.City;
            }
            if (!string.IsNullOrEmpty(editExcursionDTO.Location))
            {
                excursion.Location = editExcursionDTO.Location;
            }
            if (editExcursionDTO.Date.HasValue)
            {
                excursion.Date = editExcursionDTO.Date.Value;
            }
            if (editExcursionDTO.Price.HasValue && editExcursionDTO.Price.Value >= 0)
            {
                excursion.Price = editExcursionDTO.Price.Value;
            }
            if (editExcursionDTO.MaxParticipants.HasValue && editExcursionDTO.MaxParticipants.Value >= 2)
            {
                excursion.MaxParticipants = editExcursionDTO.MaxParticipants.Value;
            }
            if (editExcursionDTO.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await editExcursionDTO.Photo.CopyToAsync(memoryStream);
                    excursion.Photo = memoryStream.ToArray();
                }
            }

            excursion.UpdatedAt = DateTime.Now;
            excursionDbContext.Excursions.Update(excursion);
            await excursionDbContext.SaveChangesAsync();
            return excursion;
        }
    }
}
