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

        public AccountController(UserManager<AppUser> userManager, 
        SignInManager<AppUser> signInManager, TokenService tokenService,
        IConfiguration config)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

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
                    Image=null

                };
            }
            return Unauthorized();


        } 

        [HttpPost("register")]
        
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=>x.Email==registerDto.Email))
            {
                return BadRequest("email already taken");
            }

            if(await _userManager.Users.AnyAsync(x=>x.UserName==registerDto.Username))
            {
                return BadRequest("username already taken");
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
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserDto(user);

        }

        private UserDto CreateUserDto(AppUser user)
        {
            return new UserDto
                {
                    Username=user.UserName,
                    DisplayName=user.DisplayName,
                    Image = null,
                    Token = _tokenService.CreateToken(user, _config)
                };
        }

    }
}