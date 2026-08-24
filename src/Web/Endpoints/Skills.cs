using GanihuhStack.Application.Skills.Commands.CreateSkill;
using GanihuhStack.Application.Skills.Commands.DeleteSkill;
using GanihuhStack.Application.Skills.Queries.GetSkills;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class Skills : IEndpointGroup
{
    public static string? RoutePrefix => "/api/skills";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetSkills);
        groupBuilder.MapPost(CreateSkill).RequireAuthorization();
        groupBuilder.MapDelete(DeleteSkill, "{id}").RequireAuthorization();
    }

    public static async Task<Ok<List<SkillDto>>> GetSkills(ISender sender)
    {
        var result = await sender.Send(new GetSkillsQuery());
        return TypedResults.Ok(result);
    }

    public static async Task<Created<AckDto>> CreateSkill(CreateSkillCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/skills/{id}", new AckDto("Skill created successfully.", id));
    }

    public static async Task<Ok<AckDto>> DeleteSkill(int id, ISender sender)
    {
        await sender.Send(new DeleteSkillCommand(id));
        return TypedResults.Ok(new AckDto("Skill deleted successfully.", id));
    }
}
