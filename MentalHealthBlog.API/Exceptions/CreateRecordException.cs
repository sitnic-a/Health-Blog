namespace MentalHealthBlog.API.Exceptions
{
    public class CreateRecordException : Exception
    {
        public CreateRecordException() { }

        public CreateRecordException(string message)
            : base(message) { }

        public CreateRecordException(string message, Exception inner)
            : base(message, inner) { }
    }
}
