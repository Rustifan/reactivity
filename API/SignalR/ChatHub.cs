using MediatR;
using Microsoft.AspNetCore.SignalR;
using Application.Comments;
using System.Threading.Tasks;
using System;

namespace API.SignalR
{
    public class ChatHub: Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {

        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContxt = Context.GetHttpContext();
            var activityId = httpContxt.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }    
}