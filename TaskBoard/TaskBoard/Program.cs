using FluentValidation;
using FluentValidation.AspNetCore;
using TaskBoard.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add ConnectionString
builder.Services.ConfigureConnectionString(builder.Configuration);

//Add Dependency Injection
builder.Services.RegisterServices();

//Add Auto-Mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

//Add CORS
builder.Services.AddCorsPolicy();

//add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("NgOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();

 