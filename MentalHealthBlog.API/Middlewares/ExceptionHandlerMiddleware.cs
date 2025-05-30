using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models.ResourceResponse;
using Newtonsoft.Json;
using System.Net;

namespace MentalHealthBlog.API.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        public (HttpStatusCode code, string message) GetResponse(Exception exception)
        {
            HttpStatusCode code;
            switch (exception)
            {
                case KeyNotFoundException
                    or RecordNotFoundException
                    or FileNotFoundException:
                    code = HttpStatusCode.NotFound;
                    break;
                case EmptyListException:
                    code = HttpStatusCode.NoContent; 
                    break;
                case AlreadyRegisteredException:
                    code = HttpStatusCode.Conflict;
                    break;
                case UnauthorizedAccessException
                    or PasswordExpiredException
                    or UnauthorizedAccessException
                    or InvalidTokenException:
                    code = HttpStatusCode.Unauthorized;
                    break;
                case CreateUserException
                    or NullReferenceException
                    or ArgumentException
                    or InvalidOperationException:
                    code = HttpStatusCode.BadRequest;
                    break;
                default:
                    code = HttpStatusCode.InternalServerError;
                    break;
            }
            return (code, JsonConvert.SerializeObject(new Response(statusCode: (int) code, exception.Message)));
        }
    }
}
