using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;

namespace Application.Photos
{
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            DataContext _context;
            IPhotoAccessor _photoAccessor;
            IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());
                if(user == null) return null;

                var photo = user.Photos.FirstOrDefault(x=>x.Id ==request.Id);
                if(photo == null) return null;
                if(photo.IsMain) return Result<Unit>.Faliure("You cannot delete your main photo");

                var result = await _photoAccessor.DeletePhoto(request.Id);
                if(result == null) return Result<Unit>.Faliure("Problem deleting photo from cloud");

                user.Photos.Remove(photo);

                var sucess = await _context.SaveChangesAsync() > 0;
                if(sucess) return  Result<Unit>.Sucess(Unit.Value);
                
                return Result<Unit>.Faliure("Problem deleting photo from API");

            }
        }
    }
}