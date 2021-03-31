using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
        
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            public readonly IMapper _mapper;
            public readonly DataContext _context;
            public readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }


            

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Profiles.Profile> list = new();
                switch(request.Predicate)
                {
                    case "followers":
                    list = await _context.UserFollowings
                        .Where(x=>x.Target.UserName == request.Username)
                        .Select(x=>x.Observer)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new {currentUser = _userAccessor.GetUserName()})
                        .ToListAsync(cancellationToken);
                    break;
                    case "following":
                    list = await _context.UserFollowings
                        .Where(x=>x.Observer.UserName == request.Username)
                        .Select(x=>x.Target)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new {currentUser = _userAccessor.GetUserName()})
                        .ToListAsync(cancellationToken);
                    break;
                }

                if(list == null) return null;

                return Result<List<Profiles.Profile>>.Sucess(list);
                
            }
        }
    }
}