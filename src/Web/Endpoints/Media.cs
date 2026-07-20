using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class Media : IEndpointGroup
{
    public static string? RoutePrefix => "/api/uploads";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(UploadFile).DisableAntiforgery().RequireAuthorization();
    }

    public static async Task<Results<Ok<UploadResultDto>, BadRequest<string>>> UploadFile(
        IFormFile file,
        IWebHostEnvironment env)
    {
        if (file is null || file.Length == 0)
            return TypedResults.BadRequest("File tidak valid.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return TypedResults.BadRequest("Format file tidak didukung. Gunakan JPG, PNG, GIF, WEBP, atau SVG.");

        var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativeUrl = $"/uploads/{fileName}";
        var markdownSnippet = $"![{Path.GetFileNameWithoutExtension(file.FileName)}]({relativeUrl})";

        return TypedResults.Ok(new UploadResultDto(relativeUrl, fileName, markdownSnippet));
    }
}

public record UploadResultDto(string Url, string FileName, string MarkdownSnippet);
