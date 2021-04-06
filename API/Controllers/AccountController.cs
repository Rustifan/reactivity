using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager, 
        SignInManager<AppUser> signInManager, TokenService tokenService,
        IConfiguration config)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
            _httpClient = new HttpClient
            {
                BaseAddress= new System.Uri("https://graph.facebook.com")
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u=>u.Email==loginDto.Email);

            if(user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if(result.Succeeded)
            {
                var token = _tokenService.CreateToken(user, _config);
                return new UserDto
                {
                    DisplayName=user.DisplayName,
                    Token=token,
                    Username=user.UserName,
                    Image=user.Photos?.FirstOrDefault(x=>x.IsMain)?.Url

                };
            }
            return Unauthorized();


        } 

        [HttpPost("register")]
        
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=>x.Email==registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if(await _userManager.Users.AnyAsync(x=>x.UserName==registerDto.Username))
            {
                ModelState.AddModelError("username", "Username already taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username,

            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            
            if(result.Succeeded)
            {
                return CreateUserDto(user);
            }

            return BadRequest("Problem Registering user");

        }

        [Authorize]
        [HttpGet]
        
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            
            var user = await _userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email==email);

            return CreateUserDto(user);

        }

        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbVerifyKeys = _config["Facebook:AppId"]+"|"+_config["Facebook:AppSecret"];
                var verifyToken = 
                await _httpClient
                    .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");
            if(!verifyToken.IsSuccessStatusCode)return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

            var response = await _httpClient.GetAsync(fbUrl);
            if(!response.IsSuccessStatusCode) return Unauthorized();

            var content = await response.Content.ReadAsStringAsync();
            var fbInfo = JsonConvert.DeserializeObject<dynamic>(content);

            var username = (string)fbInfo.id;

            var user = await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(u=>u.UserName == username);
            if(user != null) return CreateUserDto(user);

            user = new AppUser
            {
                DisplayName = (string)fbInfo.name,
                Email = (string)fbInfo.email,
                UserName = (string)fbInfo.id,
                Photos = new List<Photo>
                {
                    new Photo
                    {   Id = "fb_"+(string)fbInfo.id, 
                        Url=(string)fbInfo.picture.data.url, 
                        IsMain=true
                    }
                }


            };
            
            var result = await _userManager.CreateAsync(user);

            if(!result.Succeeded) return BadRequest("Problem Ccreating an account");




            return CreateUserDto(user);

        }
        private UserDto CreateUserDto(AppUser user)
        {
            return new UserDto
                {
                    Username=user.UserName,
                    DisplayName=user.DisplayName,
                    Image = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                    Token = _tokenService.CreateToken(user, _config)
                };
        }

    }
}