using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query: IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {   
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly ILogger _logger;
            public Handler(IMapper mapper, DataContext context, ILogger<Handler> logger)
            {
                _mapper = mapper;
                _context = context;
                _logger = logger;
            }
            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.Log(LogLevel.Information, request.UserName);
                var user = await _context.Users.ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x=>x.UserName==request.UserName, cancellationToken);
                

                if(user == null) return null;

                return Result<Profile>.Sucess(user);
                    
            }
        }
    }
}