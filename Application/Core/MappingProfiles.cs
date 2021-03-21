using System.Linq;
using Application.Acitivities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d=>d.HostUsername, o=>o.MapFrom(s=>s.Attendees.
                FirstOrDefault(x=>x.IsHost).AppUser.UserName));
                
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(p=>p.DisplayName, o=>o.MapFrom(s=>s.AppUser.DisplayName))
                .ForMember(p=>p.UserName, o=>o.MapFrom(s=>s.AppUser.UserName))
                .ForMember(p=>p.Bio, o=>o.MapFrom(s=>s.AppUser.Bio));

        }
    }
}