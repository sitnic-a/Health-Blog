namespace MentalHealthBlog.API.Utils
{
    public class AppSettings
    {
        public string TokenKey { get; set; } = string.Empty;
        public int RefreshTokenTTL { get; set; } = 10;
    }
}
