namespace TaskBoard.Common
{
    public class ErrorResponse
    {
        public string Title { get; set; }
        public string Message { get; set; }

        public ErrorResponse(string title, string message )
        {
            Title = title;
            Message = message;
        }
    }
}
