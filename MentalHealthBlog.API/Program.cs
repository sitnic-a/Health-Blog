using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Custom service registration
builder.Services.AddScoped<IPostService, PostService>();

builder.Services.AddDbContext<DataContext>(options =>
{

    options.UseSqlServer(builder
        .Configuration
        .GetConnectionString("DevelopmentConnection"));

    options.UseSqlServer(builder
        .Configuration
        .GetConnectionString("DevelopmentConnectionExpress"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
