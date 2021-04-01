using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Core;
using Application.Acitivities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;
using System.Linq;

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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


            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(d=>d.Date>= request.Params.StartDate)
                    .OrderBy(d=>d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUser = _userAccessor.GetUserName()})
                    .AsQueryable();
                    
                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x=>x.Attendees.Any(u=>u.UserName == _userAccessor.GetUserName()));
                }

                if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x=>x.HostUsername==_userAccessor.GetUserName());
                }

                return Result<PagedList<ActivityDto>>.Sucess(
                    await PagedList<ActivityDto>.CreateAsync(query, 
                    request.Params.PageNumber, request.Params.PageSize)
                ); 
            }
        }


    }
    

}