using AutoMapper;
using backend.Models.Domain;
using backend.Models.DTO;

namespace backend.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Excursion, ExcursionDTO>()
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Photo != null ? Convert.ToBase64String(src.Photo) : null))
                .ReverseMap();

            CreateMap<User, UserProfileDTO>().ReverseMap();
            CreateMap<UpdateUserProfileDTO, User>().ReverseMap();

            CreateMap<AddExcursionDTO, Excursion>()
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Photo != null ? ConvertFileToByteArray(src.Photo) : null))
                .ReverseMap();

            CreateMap<Excursion, ExcursionDetailsDTO>()
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Photo != null ? Convert.ToBase64String(src.Photo) : null));

            CreateMap<Excursion, EditExcursionDTO>()
            .ForMember(dest => dest.Photo, opt => opt.Ignore());
        }

        private byte[] ConvertFileToByteArray(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

    }
}
