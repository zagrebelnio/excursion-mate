using AutoMapper;
using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Excursion, ExcursionDTO>().ReverseMap();
            CreateMap<User, UserProfileDTO>().ReverseMap();
        }
    }
}
