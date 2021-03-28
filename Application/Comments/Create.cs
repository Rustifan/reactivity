using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command: IRequest<Result<CommentDto>>
        {
            public Guid ActivityId { get; set; }
            public string Body { get; set; }
        }

        public class CommentValidator: AbstractValidator<Command>
        {
            public CommentValidator()
            {
                RuleFor(x=>x.Body).NotEmpty();
            }           
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper )
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if(activity==null) return null;

                var user = await _context.Users.Include(x=>x.Photos)
                    .FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName());
                if(user == null) return null;

                var comment = new Comment
                {
                    Activity = activity,
                    Body = request.Body,
                    Author = user
                };

                activity.Comments.Add(comment);
                var result = await _context.SaveChangesAsync() > 0;
                var commentDto = _mapper.Map<CommentDto>(comment);
                if(result) return Result<CommentDto>.Sucess(commentDto);

                return Result<CommentDto>.Faliure("Failed to create comment");
            }
        }
    }
}