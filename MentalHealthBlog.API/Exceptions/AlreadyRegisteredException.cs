namespace MentalHealthBlog.API.Exceptions
{
    public class AlreadyRegisteredException : Exception
    {
        public AlreadyRegisteredException() { }

        public AlreadyRegisteredException(string message)
            : base(message) { }

        public AlreadyRegisteredException(string message, Exception inner)
            : base(message, inner) { }
    }
}
