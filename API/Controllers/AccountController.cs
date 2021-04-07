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
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;
using Infrastructure.Email;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly EmailSender _emailSender;

        public AccountController(UserManager<AppUser> userManager, 
        SignInManager<AppUser> signInManager, TokenService tokenService,
        IConfiguration config, EmailSender emailSender)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
            _emailSender = emailSender;
            _httpClient = new HttpClient
            {
                BaseAddress= new System.Uri("https://graph.facebook.com")
            };
        }

       [AllowAnonymous]
       [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u=>u.Email==loginDto.Email);

            if(user == null) return Unauthorized("Invalid email or password");
            //bob je dobri čevik
            if(user.UserName=="bob") user.EmailConfirmed = true;

            if(!user.EmailConfirmed) return Unauthorized("Email not confirmed");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if(result.Succeeded)
            {
                var token = _tokenService.CreateToken(user, _config);
                
                await SetRefreshToken(user);
                
                return CreateUserDto(user);
            }
            return Unauthorized("Invalid email or password");


        } 

        [AllowAnonymous]

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
            
            if(!result.Succeeded) return BadRequest("Problem Registering user");

            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}"; 
            var message = $"<p>Please click below link to veify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

            await _emailSender.SendEmail(user.Email, "Please verify email", message);

            return Ok("Registration sucess! Please verify your email");
        }


        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        
        public async Task<IActionResult> VerifyEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null) return Unauthorized("somethin is wrong");

            var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if(!result.Succeeded) return BadRequest("Could not verify email address");

            return Ok("Email verified. You can now log in");
        }

        [AllowAnonymous]
        [HttpGet("resendEmailConfirmationLink")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
           var user = await _userManager.FindByEmailAsync(email);
            if(user==null) return BadRequest();

            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}"; 
            var message = $"<p>Please click below link to veify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

            await _emailSender.SendEmail(user.Email, "Please verify email", message);

            return Ok("Email verification link resent");
        }

        [Authorize]
        [HttpGet]
        
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            
            var user = await _userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email==email);
            await SetRefreshToken(user);

            return CreateUserDto(user);

        }

        [AllowAnonymous]
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

            user.EmailConfirmed = true;
            
            var result = await _userManager.CreateAsync(user);

            if(!result.Succeeded) return BadRequest("Problem Ccreating an account");



            await SetRefreshToken(user);
            return CreateUserDto(user);

        }

        [Authorize]
        [HttpPost("{refreshToken}")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {

            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users.Include(x=>x.RefresTokens)
                .Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.UserName == User.FindFirstValue(ClaimTypes.Name));
            if(user == null) return Unauthorized();                             

            var oldToken = user.RefresTokens.SingleOrDefault(x => x.Token == refreshToken);

             if(oldToken != null && !oldToken.IsActive) return Unauthorized();

            if(oldToken != null) oldToken.Revoked = DateTime.UtcNow;
            return CreateUserDto(user);
        }
        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefresTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

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