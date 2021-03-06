using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Acitivities
{
    public class Delete
    {
        public class Command: IRequest
        {
            public Guid id;
            public Command(Guid id)
            {
                this.id = id;
            }
        }

        public class Handle : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handle(DataContext context)
            {
                _context = context;
            }
            async Task<Unit> IRequestHandler<Command, Unit>.Handle(Command request, CancellationToken cancellationToken)
            {

                Activity activity = await _context.Activities.FindAsync(request.id);
                
                _context.Activities.Remove(activity);
                
                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }

    }
}