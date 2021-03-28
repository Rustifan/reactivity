using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query: IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.Include(x=>x.Comments)
                 .FirstOrDefaultAsync(x=>x.Id == request.ActivityId);
                if(activity==null) return null;
                var comments = activity.Comments.OrderBy(x=>x.CreatedAt);

                var commentsDto = new List<CommentDto>();
                foreach(var comment in comments)
                {
                    commentsDto.Add(_mapper.Map<CommentDto>(comment));
                }

                return Result<List<CommentDto>>.Sucess(commentsDto);
            }
        }
    }
}