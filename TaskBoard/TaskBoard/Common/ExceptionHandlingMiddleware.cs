using Newtonsoft.Json;
using System.Net;


namespace TaskBoard.Common
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate request;

        public ExceptionHandlingMiddleware(RequestDelegate request)
        {
            this.request = request;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await request(context);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse("Internal Server Error", ex.Message);
                var json = JsonConvert.SerializeObject(errorResponse);


                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync(json);
            }
        }
    }

}
