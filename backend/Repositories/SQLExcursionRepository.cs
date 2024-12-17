using AutoMapper;
using backend.Data;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backend.Repositories
{
    public class SQLExcursionRepository : IExcursionRepository
    {

        private readonly ExcursionDbContext excursionDbContext;
        private readonly IMapper mapper;

        public SQLExcursionRepository(ExcursionDbContext excursionDbContext, IMapper mapper)
        {
            this.excursionDbContext = excursionDbContext;
            this.mapper = mapper;
        }

        public async Task<Excursion> CreateAsync(AddExcursionDTO addExcursionDTO, string userId)
        {
            var excursion = mapper.Map<Excursion>(addExcursionDTO);

            excursion.UserId = userId;

            if (addExcursionDTO.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await addExcursionDTO.Photo.CopyToAsync(memoryStream);
                    excursion.Photo = memoryStream.ToArray();
                }
            }

            await excursionDbContext.Excursions.AddAsync(excursion);
            await excursionDbContext.SaveChangesAsync();
            return excursion;
        }

        public async Task<Excursion?> DeleteAsync(int id)
        {
            var excursion = await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
            if (excursion != null)
            {
                excursionDbContext.Excursions.Remove(excursion);
                await excursionDbContext.SaveChangesAsync();
            }
            return null;
        }

        public async Task<(List<Excursion> Items, int TotalCount)> GetAllAsync(string? title, string? city, int? minPrice, int? maxPrice, DateTime? date, int page = 1, int pageSize = 9)
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

            var totalCount = await query.CountAsync();
            var skipResults = (page - 1) * pageSize;
            var items = await query.Skip(skipResults).Take(pageSize).ToListAsync();

            return (Items: items, TotalCount: totalCount);
        }

        public async Task<Excursion?> GetByIdAsync(int id)
        {
            return await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Excursion>> GetByUserIdAsync(string userId)
        {
            return await excursionDbContext.Excursions.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<string?> GetReactionAsync(string userId, int excursionId)
        {
            var reaction = await excursionDbContext.ExcursionReactions.
                Where(er => er.UserId == userId && er.ExcursionId == excursionId).
                Select(er => er.ReactionType).
                FirstOrDefaultAsync();

            return reaction switch
            {
                ReactionType.Like => "Like",
                ReactionType.Dislike => "Dislike",
                _ => null
            };
        }

        public async Task<bool> IsUserOwnerAsync(int excursionId, string userId)
        {
            var excursion = await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == excursionId);
            return excursion?.UserId == userId;
        }

        public async Task<Excursion?> UpdateAsync(int id, EditExcursionDTO editExcursionDTO)
        {
            var excursion = await excursionDbContext.Excursions.FirstOrDefaultAsync(e => e.Id == id);
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
