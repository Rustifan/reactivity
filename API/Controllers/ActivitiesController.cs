using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Domain;

using Application.Activities;
using Application.Acitivities;
using Application.Core;
using Microsoft.AspNetCore.Authorization;



namespace API.Controllers
{
    [AllowAnonymous]

    public class ActivitiesController: BaseApiController
    {
        

        public ActivitiesController()
        {
            
        }

        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            Result<List<Activity>> result = await Mediator.Send(new List.Query());
            return HandleResult<List<Activity>>(result);
        }

        
        [HttpGet("{id}")]

        public async Task<IActionResult> GetActivity(Guid id)
        {
            Result<Activity> result = await Mediator.Send(new Details.Query(id));
            return HandleResult<Activity> (result);
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command(activity)));
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command(activity)));
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command(id)));
        }
    }
        
} 