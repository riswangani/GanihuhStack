namespace GanihuhStack.Application.BlogPosts.Commands.DeleteBlogPost;

public record DeleteBlogPostCommand(int Id) : IRequest;

public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBlogPostCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = await _context.BlogPosts
            .FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, blogPost);

        _context.BlogPosts.Remove(blogPost);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
