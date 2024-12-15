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

            CreateMap<(List<Excursion> Items, int TotalCount), PagedResponse<ExcursionDTO>>()
               .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
               .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.TotalCount))
               .ForMember(dest => dest.TotalPages, opt => opt.Ignore()) 
               .ForMember(dest => dest.CurrentPage, opt => opt.Ignore()) 
               .ForMember(dest => dest.PageSize, opt => opt.Ignore());

            CreateMap<FavoriteExcursion, FavoriteExcursionDTO>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Excursion.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Excursion.Description))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.Excursion.City))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Excursion.Date))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Excursion.Price))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Excursion.Id))
                .ForMember(dest => dest.Likes, opt => opt.MapFrom(src => src.Excursion.Likes))
                .ForMember(dest => dest.Dislikes, opt => opt.MapFrom(src => src.Excursion.Dislikes))
                .ForMember(dest => dest.MaxParticipants, opt => opt.MapFrom(src => src.Excursion.MaxParticipants))
                .ForMember(dest => dest.CurrentParticipants, opt => opt.MapFrom(src => src.Excursion.CurrentParticipants))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Excursion.Photo != null ? Convert.ToBase64String(src.Excursion.Photo) : null));

            CreateMap<Excursion, FavoriteExcursionDTO>()
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Photo != null ? Convert.ToBase64String(src.Photo) : null));

            CreateMap<User, UserWithRoleDTO>().ForMember(dest => dest.Role, opt => opt.Ignore());

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
