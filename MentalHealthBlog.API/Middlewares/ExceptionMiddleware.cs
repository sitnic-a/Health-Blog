namespace MentalHealthBlog.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private ILogger<ExceptionMiddleware> _middlewareLogger;
        private readonly RequestDelegate _next;
        private ExceptionHandlerMiddleware _exceptionHandler = new ExceptionHandlerMiddleware();

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> middlewareLogger)
        {
            _next = next;
            _middlewareLogger = middlewareLogger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception e)
            {
                _middlewareLogger.LogError($"ERROR: {e.Message} - {e.InnerException}", e);
                httpContext.Response.ContentType = "application/json";
                var (status,message) = _exceptionHandler.GetResponse(e);
                httpContext.Response.StatusCode = (int) status;
                await httpContext.Response.WriteAsync(message);
            }
        }
        
    }
}
