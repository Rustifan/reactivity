using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;

namespace Application.Acitivities
{
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid id;
            public Command(Guid id)
            {
                this.id = id;
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            
            public Handler(DataContext context)
            {
                _context = context;
            }
           
            async Task<Result<Unit>> IRequestHandler<Command, Result<Unit>>.Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.id);
                
                if(activity == null) return null;
                
                _context.Activities.Remove(activity);
                
                var res = await _context.SaveChangesAsync() > 0;
                if(!res) return Result<Unit>.Faliure("failed to delete activity");


                return Result<Unit>.Sucess(Unit.Value);
            }
        }

    }
}