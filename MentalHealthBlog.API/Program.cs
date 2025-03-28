using MentalHealthBlog.API.Services;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MentalHealthBlog.API.Utils;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MentalHealthBlog.API.Utils.SignalR;

#pragma warning disable 8604

var builder = WebApplication.CreateBuilder(args);

//Configure services
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MentalHealthBlog.API", Version = "v1" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

//Automapper
builder.Services.AddAutoMapper(typeof(Program));
//SignalR
builder.Services.AddSignalR();

//CORS registration
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "localPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

//HttpContextAccesor register
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

//Custom service registration
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<IStatisticsService, StatisticsService>();
builder.Services.AddScoped<IExportService, ExportService>();
builder.Services.AddScoped<IShareService, ShareService>();
builder.Services.AddScoped<IMentalExpertService, MentalExpertService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IRegularUserService, RegularUserService>();
builder.Services.AddScoped<IEmotionService, EmotionService>();

builder.Services.AddDbContext<DataContext>(options =>
{

    options.UseSqlServer(builder
        .Configuration
        .GetConnectionString("DevelopmentConnection"));

    options.UseSqlServer(builder
        .Configuration
        .GetConnectionString("DevelopmentConnectionExpress"));
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ClockSkew = TimeSpan.Zero,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["AppSettings:TokenKey"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        
    };
});

builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("localPolicy");
app.MapHub<AdminHub>("api/rt-new-request");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
