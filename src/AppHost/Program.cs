using GanihuhStack.Shared;

var builder = DistributedApplication.CreateBuilder(args);

// var databaseServer = builder
//    .AddAzurePostgresFlexibleServer(Services.DatabaseServer)
//    .WithPasswordAuthentication()
//    .RunAsContainer(container => 
//        container.WithLifetime(ContainerLifetime.Persistent))
//    .AddDatabase(Services.Database);

var web = builder.AddProject<Projects.Web>(Services.WebApi)
    .WithEndpoint("http", endpoint => endpoint.Port = 5056)
    .WithExternalHttpEndpoints()
    .WithAspNetCoreEnvironment()
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Scalar API Reference";
        url.Url = "/scalar";
    });

if (builder.ExecutionContext.IsRunMode)
{
    builder.AddViteApp(Services.WebFrontend, "./../Web/ClientApp")
        .WithBun()
        .WithRunScript("dev")
        .WithReference(web)
        .WithEndpoint("http", endpoint => endpoint.Port = 5173)
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
