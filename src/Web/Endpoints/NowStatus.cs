using GanihuhStack.Application.NowStatuses.Commands.UpdateNowStatus;
using GanihuhStack.Application.NowStatuses.Queries.GetCurrentNowStatus;
using GanihuhStack.Application.NowStatuses.Queries.GetNowStatusHistory;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class NowStatus : IEndpointGroup
{
    public static string? RoutePrefix => "/api/now-status";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCurrentNowStatus);
        groupBuilder.MapGet(GetNowStatusHistory, "history");
        groupBuilder.MapPost(UpdateNowStatus).RequireAuthorization();
    }

    // GET /api/now-status (Mengambil 1 status paling baru untuk Fokus Utama)
    public static async Task<Ok<NowStatusDto?>> GetCurrentNowStatus(ISender sender)
    {
        var result = await sender.Send(new GetCurrentNowStatusQuery());
        return TypedResults.Ok<NowStatusDto?>(result);
    }

    // GET /api/now-status/history (Mengambil riwayat status terdahulu/lampau)
    public static async Task<Ok<List<NowStatusDto>>> GetNowStatusHistory(ISender sender)
    {
        var result = await sender.Send(new GetNowStatusHistoryQuery());
        return TypedResults.Ok(result);
    }

    public static async Task<Created<AckDto>> UpdateNowStatus(UpdateNowStatusCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/now-status/{id}", new AckDto("Now status updated successfully.", id));
    }
}

