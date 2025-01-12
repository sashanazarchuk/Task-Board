using BusinessLogic.DTOs;
using Entities.Models;

namespace BusinessLogic.Mapper
{
    public class Mapper : AutoMapper.Profile
    {
        public Mapper()
        {

            CreateMap<CardDto, Card>();
            CreateMap<Card, CardDto>();
 
            CreateMap<CardList, CardListDto>();
            CreateMap<CardListDto, CardList>();

            CreateMap<ActivityDto, Activity>();
            CreateMap<Activity, ActivityDto>();

            CreateMap<HistoryDto, History>();
            CreateMap<History, HistoryDto>();

            CreateMap<BoardDto, Board>();
            CreateMap<Board, BoardDto>()
                .ForMember(dest => dest.ListDtos, opt => opt.MapFrom(src => src.CardLists));
                 
        }
    }
}
