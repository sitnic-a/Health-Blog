FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY [".", "."]
RUN dotnet restore "./MentalHealthBlog.API.csproj"
COPY . .

WORKDIR "/src/."
RUN dotnet build "MentalHealthBlog.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MentalHealthBlog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

COPY ["/Data/EmotionWheel.xlsx", "/mnt/d/Data/EmotionWheel.xlsx"]

ENTRYPOINT ["dotnet", "MentalHealthBlog.API.dll"]
