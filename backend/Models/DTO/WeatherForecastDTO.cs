namespace backend.Models.DTO
{
    public class WeatherForecastDTO
    {
        public double Temperature { get; set; }
        public string WeatherDescription { get; set; }
        public double WindSpeed { get; set; }
        public double FeelsLike { get; set; }
        public double Humidity { get; set; }
    }
}
