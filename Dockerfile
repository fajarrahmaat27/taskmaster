FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TaskMasterAPI/TaskMasterAPI.csproj", "TaskMasterAPI/"]
RUN dotnet restore "TaskMasterAPI/TaskMasterAPI.csproj"
COPY TaskMasterAPI/ TaskMasterAPI/
RUN dotnet publish "TaskMasterAPI/TaskMasterAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENTRYPOINT ["dotnet", "TaskMasterAPI.dll"]