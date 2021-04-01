using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPagingHeader(this HttpResponse response, int currentPage,
        int itemsPerPage, int totalItems, int totalPages)
        {
            var pagintationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagintationHeader));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}