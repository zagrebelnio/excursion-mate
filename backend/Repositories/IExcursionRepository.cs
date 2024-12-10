﻿using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Repositories
{
    public interface IExcursionRepository
    {
        Task<List<Excursion>> GetAllAsync(string? title, string? city, int? minPrice, int? maxPrice, DateTime? date, int page, int pageSize);
        Task<Excursion> CreateAsync(Excursion excursion);
        Task<Excursion?> GetByIdAsync(int id);
        Task<Excursion?> DeleteAsync(int id);
        Task<Excursion?> UpdateAsync(int id, EditExcursionDTO editExcursionDTO);
        Task<bool> IsUserOwnerAsync(int excursionId, string userId);
    }
}
