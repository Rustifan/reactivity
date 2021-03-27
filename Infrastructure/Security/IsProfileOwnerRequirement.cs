using System.IO.Pipelines;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class IsProfileOwnerRequirement : IAuthorizationRequirement
    {

    }

    public class IsProfileOwnerRequirementHandeler : AuthorizationHandler<IsProfileOwnerRequirement, Profile>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsProfileOwnerRequirementHandeler(IUserAccessor userAccessor, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _userAccessor = userAccessor;

        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsProfileOwnerRequirement requirement, Profile profile)
        {
            var username = _userAccessor.GetUserName();
            if(username == null) return Task.CompletedTask;

           
            var ownedUsername = profile.UserName;
            
            if(ownedUsername == null) return Task.CompletedTask;

            if(username == ownedUsername)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
            
        }
    }

}