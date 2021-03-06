using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Acitivities
{
    public class Create
    {
        public class Command: IRequest
        {
            public Activity activity;

            public Command(Activity activity)
            {
                this.activity = activity;
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context; 
            public Handler(DataContext context)
            {
                _context = context;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.activity);
                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }

    }
}