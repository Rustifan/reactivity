using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Application.Core;


namespace Application.Acitivities
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Activity activity;
            public Command(Activity activity)
            {
                this.activity = activity;
            }
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                this.RuleFor(x=>x.activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            async Task<Result<Unit>> IRequestHandler<Command, Result<Unit>>.Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.activity.Id, cancellationToken);
                
                if(activity == null) return null;

                _mapper.Map(request.activity, activity);

                bool result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Faliure("failed to edit activity");

                return Result<Unit>.Sucess(Unit.Value);
            }
        }
    }
}