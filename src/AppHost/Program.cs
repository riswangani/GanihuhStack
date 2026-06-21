using GanihuhStack.Shared;

var builder = DistributedApplication.CreateBuilder(args);

// var databaseServer = builder
//    .AddAzurePostgresFlexibleServer(Services.DatabaseServer)
//    .WithPasswordAuthentication()
//    .RunAsContainer(container => 
//        container.WithLifetime(ContainerLifetime.Persistent))
//    .AddDatabase(Services.Database);

var web = builder.AddProject<Projects.Web>(Services.WebApi)
    // .WithReference(databaseServer)
    // .WaitFor(databaseServer)
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
        // .WaitFor(web)
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
