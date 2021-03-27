using System;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseApiController
    {
        
        [HttpGet("{username}")]
        public async Task<IActionResult> Details(string username)
        {
            
            return HandleResult(await Mediator.Send(new Details.Query{UserName = username}));
        }

        [HttpPut]
        public async Task<IActionResult> Edit(EditProfileDto profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command{EditProfile=profile}));
        }
    }
}