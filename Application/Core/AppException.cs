namespace Application.Core
{
    public class AppException
    {
        public AppException(string error, int statusCode, string details=null)
        {
            Error = error;
            StatusCode = statusCode;
            Details = details;
        }

        public string Error { get; set; }
        public int StatusCode { get; set; }

        public string Details { get; set; }
    }
}