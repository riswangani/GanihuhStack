using GanihuhStack.Application.Projects.Commands.CreateProject;
using GanihuhStack.Application.Projects.Commands.DeleteProject;
using GanihuhStack.Application.Projects.Commands.UpdateProject;
using GanihuhStack.Application.Projects.Queries.GetProjects;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class Projects : IEndpointGroup
{
    public static string? RoutePrefix => "/api/projects";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetProjects);
        groupBuilder.MapPost(CreateProject).RequireAuthorization();
        groupBuilder.MapPut(UpdateProject, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteProject, "{id}").RequireAuthorization();
    }

    public static async Task<Ok<List<ProjectDto>>> GetProjects(ISender sender)
    {
        var result = await sender.Send(new GetProjectsQuery());
        return TypedResults.Ok(result);
    }

    public static async Task<Created<AckDto>> CreateProject(CreateProjectCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/projects/{id}", new AckDto("Project created successfully.", id));
    }

    public static async Task<Ok<AckDto>> UpdateProject(int id, UpdateProjectCommand command, ISender sender)
    {
        await sender.Send(command with { Id = id });
        return TypedResults.Ok(new AckDto("Project updated successfully.", id));
    }

    public static async Task<Ok<AckDto>> DeleteProject(int id, ISender sender)
    {
        await sender.Send(new DeleteProjectCommand(id));
        return TypedResults.Ok(new AckDto("Project deleted successfully.", id));
    }
}

