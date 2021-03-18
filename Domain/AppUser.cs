using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser: IdentityUser
    {
        public string DisplayName {set; get;}

        public string Bio {get; set;}
    }
}