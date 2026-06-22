namespace GanihuhStack.Application.BlogPosts.Commands.DeleteBlogPost;

public record DeleteBlogPostCommand(int Id) : IRequest;

public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand>
{
    private static readonly Action<ILogger, int, Exception?> LogDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            new EventId(3, "BlogPostDeleted"),
            "Blog post deleted. Id: {Id}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteBlogPostCommandHandler> _logger;

    public DeleteBlogPostCommandHandler(IApplicationDbContext context, ILogger<DeleteBlogPostCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(DeleteBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = await _context.BlogPosts
            .FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, blogPost);

        _context.BlogPosts.Remove(blogPost);
        await _context.SaveChangesAsync(cancellationToken);

        LogDeleted(_logger, request.Id, null);
    }
}
