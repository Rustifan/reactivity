using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName(), cancellationToken);
                if(user == null) return null;

                var target = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == request.Username, cancellationToken);
                if(target==null) return null;

                var following = await _context.UserFollowings.FirstOrDefaultAsync(x=>x.TargetId==target.Id && x.ObserverId == user.Id, cancellationToken);

                if(following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = user,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(result) return Result<Unit>.Sucess(Unit.Value);

                return Result<Unit>.Faliure("Failed to add following");
            }
        }
    }
}