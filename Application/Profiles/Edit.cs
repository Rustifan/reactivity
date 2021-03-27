using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
        {
            public EditProfileDto EditProfile { get; set; }
        }

        public class CommandValidator: AbstractValidator<EditProfileDto>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.DisplayName).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper=mapper;
                _context=context;
                _userAccessor=userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u=>u.UserName==_userAccessor.GetUserName(), cancellationToken);
                if(user == null) return null;
                _mapper.Map(request.EditProfile, user);

                var result = await _context.SaveChangesAsync(cancellationToken)>0;
                if(!result) return Result<Unit>.Faliure("Failed to update profile");

                return Result<Unit>.Sucess(Unit.Value);
            }
        }
    }
}