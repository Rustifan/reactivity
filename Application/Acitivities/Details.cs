using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Acitivities
{
    public class Details
    {
        public class Query: IRequest<Result<ActivityDto>>
        {
            public Guid Id;

            public Query(Guid Id)
            {
                this.Id = Id;
            }
             
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUser = _userAccessor.GetUserName()});
                var activity = await activities.FirstOrDefaultAsync(x=>request.Id==x.Id, cancellationToken);

                return Result<ActivityDto>.Sucess(activity);
            }
        }

    }
}