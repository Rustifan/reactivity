using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Acitivities
{
    public class Details
    {
        public class Query: IRequest<Result<Activity>>
        {
            public Guid Id;

            public Query(Guid Id)
            {
                this.Id = Id;
            }
             
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {

            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.Id);
                return Result<Activity>.Sucess(activity);
            }
        }

    }
}