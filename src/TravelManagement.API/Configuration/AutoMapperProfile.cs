// ==================== AutoMapperProfile.cs ====================
using AutoMapper;
using TravelManagement.API.Models.DTOs;
using TravelManagement.API.Models.Entities;

namespace TravelManagement.API.Configuration;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();
        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // TravelPackage mappings
        CreateMap<TravelPackage, TravelPackageDto>();
        CreateMap<CreateTravelPackageDto, TravelPackage>();
        CreateMap<UpdateTravelPackageDto, TravelPackage>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // Booking mappings
        CreateMap<Booking, BookingDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
            .ForMember(dest => dest.PackageTitle, opt => opt.MapFrom(src => src.TravelPackage.Title));
        CreateMap<CreateBookingDto, Booking>();
    }
}