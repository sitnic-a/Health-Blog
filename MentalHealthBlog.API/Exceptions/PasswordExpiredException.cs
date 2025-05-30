namespace MentalHealthBlog.API.Exceptions
{
    public class PasswordExpiredException : Exception
    {
        public PasswordExpiredException() { }

        public PasswordExpiredException(string message)
            : base(message) { }

        public PasswordExpiredException(string message, Exception inner)
            : base(message, inner) { }
    }
}
