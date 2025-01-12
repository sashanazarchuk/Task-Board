using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using BusinessLogic.Services;
using Entities.Data;
using Microsoft.EntityFrameworkCore;

namespace TaskBoard.Common
{
    public static class ConfigurationHelper
    {

        public static void ConfigureConnectionString(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("sqlConnection"));
            });
        }


        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<ICardService<CardDto>, CardService>();
            services.AddScoped<ICardListService<CardListDto>, CardListService>();
            services.AddScoped<IActivityService<ActivityDto>, ActivityService>();
            services.AddScoped<IHistoryService<HistoryDto>, HistoryService>();
            services.AddScoped<IBoardService<BoardDto>, BoardService>();
        }


        public static void AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: "NgOrigins",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:4200", "https://frabjous-faun-751cb2.netlify.app").AllowAnyMethod().AllowAnyHeader();
                    });
            });
        }
    }
}
