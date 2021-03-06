using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Acitivities
{
    public class Edit
    {
        public class Command: IRequest
        {
            public Activity activity;
            public Command(Activity activity)
            {
                this.activity = activity;
            }
        }

        public class Handle : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handle(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            async Task<Unit> IRequestHandler<Command, Unit>.Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.activity.Id);
                
                _mapper.Map(request.activity, activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}