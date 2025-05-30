namespace MentalHealthBlog.API.Exceptions
{
    public class EmptyListException : Exception
    {
        public EmptyListException() { }

        public EmptyListException(string message)
            : base(message) { }

        public EmptyListException(string message, Exception inner)
            : base(message, inner) { }
    }
}
