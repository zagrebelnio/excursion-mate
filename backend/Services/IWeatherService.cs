using backend.Models.DTO;

namespace backend.Services
{
    public interface IWeatherService
    {
        Task<WeatherForecastDTO?> GetWeatherForecastAsync(string city, DateTime date);
    }
}
