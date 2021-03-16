using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class BaseApiController: Controller
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator??= HttpContext.RequestServices.GetService<IMediator>();

        protected IActionResult HandleResult<T>(Result<T> result)
        {
            if(result == null) return NotFound();
            if(result.IsSucess && result.Value == null) return NotFound();
            else if(result.IsSucess && result.Value != null) return Ok(result.Value);
            else return BadRequest();
        }         
    }
}