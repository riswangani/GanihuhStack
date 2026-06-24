using GanihuhStack.Application.BlogPosts.Commands.CreateBlogPost;
using GanihuhStack.Application.BlogPosts.Commands.DeleteBlogPost;
using GanihuhStack.Application.BlogPosts.Commands.UpdateBlogPost;
using GanihuhStack.Application.BlogPosts.Queries.GetBlogPostBySlug;
using GanihuhStack.Application.BlogPosts.Queries.GetBlogPosts;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class BlogPosts : IEndpointGroup
{
    public static string? RoutePrefix => "/api/blog-posts";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBlogPosts);
        groupBuilder.MapGet(GetBlogPostBySlug, "{slug}");
        groupBuilder.MapPost(CreateBlogPost).RequireAuthorization();
        groupBuilder.MapPut(UpdateBlogPost, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteBlogPost, "{id}").RequireAuthorization();
    }

    public static async Task<Ok<BlogPostDto>> GetBlogPostBySlug(string slug, ISender sender)
    {
        var result = await sender.Send(new GetBlogPostBySlugQuery(slug));
        return TypedResults.Ok(result);
    }

    public static async Task<Ok<List<BlogPostDto>>> GetBlogPosts(ISender sender)
    {
        var result = await sender.Send(new GetBlogPostsQuery());
        return TypedResults.Ok(result);
    }

    public static async Task<Created<AckDto>> CreateBlogPost(CreateBlogPostCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/blogposts/{id}", new AckDto("Blog post created successfully.", id));
    }

    public static async Task<Ok<AckDto>> UpdateBlogPost(int id, UpdateBlogPostCommand command, ISender sender)
    {
        await sender.Send(command with { Id = id });
        return TypedResults.Ok(new AckDto("Blog post updated successfully.", id));
    }

    public static async Task<Ok<AckDto>> DeleteBlogPost(int id, ISender sender)
    {
        await sender.Send(new DeleteBlogPostCommand(id));
        return TypedResults.Ok(new AckDto("Blog post deleted successfully.", id));
    }
}
