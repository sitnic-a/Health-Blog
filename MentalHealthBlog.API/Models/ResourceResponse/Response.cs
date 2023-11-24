namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class Response
    {
        public object ServiceResponseObject { get; set; }
        public int StatusCode { get; set; } = 0;
        public string Message { get; set; } = string.Empty;

        public Response() { ServiceResponseObject = new object(); }

        public Response(object serviceResponseObject, int statusCode, string message)
        {
            ServiceResponseObject = serviceResponseObject;
            StatusCode = statusCode;
            Message = message;
        }
        
    }
}
