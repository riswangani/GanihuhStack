# Multi-stage Dockerfile for ASP.NET Core Minimal API
# Context: Repository Root

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy props files
COPY ["Directory.Build.props", "./"]
COPY ["Directory.Packages.props", "./"]

# Copy project files for cached dependency restore
COPY ["src/Shared/Shared.csproj", "src/Shared/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/ServiceDefaults/ServiceDefaults.csproj", "src/ServiceDefaults/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Web/Web.csproj", "src/Web/"]

RUN dotnet restore "src/Web/Web.csproj"

# Copy source code
COPY src/ src/

WORKDIR "/src/src/Web"
RUN dotnet publish "Web.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:PublishRunWebpack=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GanihuhStack.Web.dll"]
