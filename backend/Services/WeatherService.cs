using AutoMapper;
using backend.Models.Domain;
using backend.Models.DTO;
using Newtonsoft.Json;
using System.Net.Http;

namespace backend.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public WeatherService(IHttpClientFactory httpClientFactory, IConfiguration configuration, IMapper mapper)
        {
            this.httpClientFactory = httpClientFactory;
            this.configuration = configuration;
            this.mapper = mapper;
        }
        public async Task<WeatherForecastDTO?> GetWeatherForecastAsync(string city, DateTime date)
        {
            using (HttpClient httpClient = httpClientFactory.CreateClient())
            {
                string dateString = date.ToString("yyyy-MM-dd");

                var url = $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{city}/{dateString}?unitGroup=metric&key={configuration["VISUAL_CROSSING_API_KEY"]}&contentType=json";
                Console.WriteLine(url);

                var response = await httpClient.GetStringAsync(url);
                var forecastResponse = JsonConvert.DeserializeObject<WeatherForecastResponse>(response);

                if (forecastResponse == null || forecastResponse.Days == null) return null;
                var forecastDay = forecastResponse.Days.FirstOrDefault(f => f.Datetime == dateString);
                if (forecastDay == null) return null;

                return new WeatherForecastDTO
                {
                    Temperature = forecastDay.Temp,
                    WeatherDescription = forecastDay.Description,
                    WindSpeed = forecastDay.Windspeed, 
                    Humidity = forecastDay.Humidity,
                    FeelsLike = forecastDay.FeelsLike,
                };
            }
        }

    }
}
