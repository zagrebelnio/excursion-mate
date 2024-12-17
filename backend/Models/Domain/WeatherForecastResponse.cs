namespace backend.Models.Domain
{
    public class WeatherForecastResponse
    {
        public List<DayForecast> Days { get; set; }  
    }

    public class DayForecast
    {
        public string Datetime { get; set; }  
        public double Temp { get; set; }  
        public double Windspeed { get; set; }  
        public double Humidity { get; set; }  
        public double FeelsLike { get; set; }
        public string Description { get; set; }  
    }
}
