using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection service, IConfiguration config)
        {
            service.AddIdentityCore<AppUser>((opt)=>
            {
                opt.Password.RequireNonAlphanumeric = false;    
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ZeldaDaBeast is the best"));


            service.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt=>
            {
                opt.TokenValidationParameters =  new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            service.AddScoped<TokenService>();

            return service;
        }
    }
}