using GanihuhStack.Application.BlogPosts.Commands.CreateBlogPost;
using GanihuhStack.Application.BlogPosts.Commands.DeleteBlogPost;
using GanihuhStack.Application.BlogPosts.Commands.UpdateBlogPost;
using GanihuhStack.Application.BlogPosts.Queries.GetBlogPosts;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GanihuhStack.Web.Endpoints;

public class BlogPosts : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBlogPosts);
        groupBuilder.MapPost(CreateBlogPost).RequireAuthorization();
        groupBuilder.MapPut(UpdateBlogPost, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteBlogPost, "{id}").RequireAuthorization();
    }

    // GET /api/blogposts
    public static async Task<Ok<List<BlogPostDto>>> GetBlogPosts(ISender sender)
    {
        var result = await sender.Send(new GetBlogPostsQuery());
        return TypedResults.Ok(result);
    }

    // POST /api/blogposts
    public static async Task<Created<int>> CreateBlogPost(CreateBlogPostCommand command, ISender sender)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/blogposts/{id}", id);
    }

    // PUT /api/blogposts/{id}
    public static async Task<NoContent> UpdateBlogPost(int id, UpdateBlogPostCommand command, ISender sender)
    {
        await sender.Send(command with { Id = id });
        return TypedResults.NoContent();
    }

    // DELETE /api/blogposts/{id}
    public static async Task<NoContent> DeleteBlogPost(int id, ISender sender)
    {
        await sender.Send(new DeleteBlogPostCommand(id));
        return TypedResults.NoContent();
    }
}
