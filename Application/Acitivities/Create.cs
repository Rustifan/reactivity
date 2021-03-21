using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Application.Core;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Acitivities
{
    public class Create
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Activity activity;

            public Command(Activity activity)
            {
                this.activity = activity;
            }
        }

        public class CommandValidator: AbstractValidator<Create.Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.activity.City).NotEmpty();
            }
            
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x=>
                x.UserName == _userAccessor.GetUserName());

                var atendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.activity,
                    IsHost = true
                };

                request.activity.Attendees.Add(atendee);
                                
                _context.Activities.Add(request.activity);
                var res = await _context.SaveChangesAsync(CancellationToken.None);
                if(res==0) return Result<Unit>.Faliure("failed to create activity");
                return Result<Unit>.Sucess(Unit.Value);
            }
        }

    }
}