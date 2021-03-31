using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController: BaseApiController
    {
        [HttpPost("{username}")]

        public async Task<IActionResult> FollowToggle(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command{Username = username}));
        }

        [HttpGet("{username}")]

        public async Task<IActionResult> GetList(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query{Username = username, Predicate = predicate}));
        }
    }
}