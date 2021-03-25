using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command: IRequest<Result<Photo>>
        {
            public string Id { get; set; }
        }


        public class Handle : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handle(DataContext context, IUserAccessor userAccessor )
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            async Task<Result<Photo>> IRequestHandler<Command, Result<Photo>>.Handle(Command request, CancellationToken cancellationToken)
            {
                
                var user = await _context.Users.Include(x=>x.Photos).FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName(), cancellationToken);
                if(user==null) return null;

                var photo = user.Photos.FirstOrDefault(x=>x.Id==request.Id);
                if(photo==null) return null;

                if(photo.IsMain) return Result<Photo>.Faliure("This photo is already main photo");

                foreach(var p in user.Photos)
                {
                    if(p.Id != request.Id)
                    {
                        p.IsMain = false;
                    }
                    
                }
                photo.IsMain = true;
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(result) return Result<Photo>.Sucess(photo);

                return Result<Photo>.Faliure("Proble saving changes to database");



            }
        }
    }
}