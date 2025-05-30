namespace MentalHealthBlog.API.Exceptions
{
    public class CreateUserException : Exception
    {
        public CreateUserException() { }

        public CreateUserException(string message)
            : base(message) { }

        public CreateUserException(string message, Exception inner)
            : base(message, inner) { }
    }
}
