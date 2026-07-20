using GanihuhStack.Application.NowStatuses.Commands.UpdateNowStatus;
using GanihuhStack.Application.NowStatuses.Queries.GetCurrentNowStatus;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class NowStatus : IEndpointGroup
{
    public static string? RoutePrefix => "/api/now-status";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCurrentNowStatus);
        groupBuilder.MapPost(UpdateNowStatus).RequireAuthorization();
    }

    public static async Task<Ok<NowStatusDto?>> GetCurrentNowStatus(ISender sender)
    {
        var result = await sender.Send(new GetCurrentNowStatusQuery());
        return TypedResults.Ok<NowStatusDto?>(result);
    }

    public static async Task<Created<AckDto>> UpdateNowStatus(UpdateNowStatusCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/now-status/{id}", new AckDto("Now status updated successfully.", id));
    }
}

