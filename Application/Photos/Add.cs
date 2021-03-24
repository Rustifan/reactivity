using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command: IRequest<Result<Photo>>
        {
            public IFormFile File {get; set;}

        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());
                if(user == null) return null;

                var photoResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoResult.Url,
                    Id = photoResult.PublicId,
                
                };

                if(!user.Photos.Any(x=>x.IsMain))
                {
                    photo.IsMain = true;
                }
                else
                {
                    photo.IsMain = false;
                }
                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Photo>.Sucess(photo);

                return Result<Photo>.Faliure("Problem adding photo");
                
            }
        }
    }
}