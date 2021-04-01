using System.Linq;
using Application.Acitivities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUser = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.
                    FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(p => p.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(p => p.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(p => p.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(p => p.Image, o => o.MapFrom(x => x.AppUser.Photos.FirstOrDefault(m => m.IsMain).Url))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(u => u.AppUser.Followings.Count))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(u => u.AppUser.Followers.Count))
                .ForMember(x => x.Following, o => o.MapFrom(u => u.AppUser.Followers.Any(f => f.Observer.UserName == currentUser))); ;

            CreateMap<AppUser, Profiles.Profile>().ForMember(p => p.Image,
            o => o.MapFrom(x => x.Photos.FirstOrDefault(m => m.IsMain).Url))
            .ForMember(x => x.FollowingCount, o => o.MapFrom(u => u.Followings.Count))
            .ForMember(x => x.FollowersCount, o => o.MapFrom(u => u.Followers.Count))
            .ForMember(x => x.Following, o => o.MapFrom(u => u.Followers.Any(f => f.Observer.UserName == currentUser)));

            CreateMap<Profiles.EditProfileDto, AppUser>();
            CreateMap<Comment, CommentDto>()
                .ForMember(u => u.Username, o => o.MapFrom(x => x.Author.UserName))
                .ForMember(u => u.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
                .ForMember(u => u.Image, o => o.MapFrom(x => x.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<ActivityAttendee, Profiles.UserActivityDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id)).ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
            .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
            .ForMember(d => d.Category, o => o.MapFrom(s =>
            s.Activity.Category))
            .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
            s.Activity.Attendees.FirstOrDefault(x =>x.IsHost).AppUser.UserName));


        }
    }
}