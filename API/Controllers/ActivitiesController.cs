using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Domain;

using Application.Activities;
using Application.Acitivities;

namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        

        public ActivitiesController()
        {
            
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query(id));
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command(activity)));
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return Ok(await Mediator.Send(new Edit.Command(activity)));
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command(id)));
        }
    }
        
}