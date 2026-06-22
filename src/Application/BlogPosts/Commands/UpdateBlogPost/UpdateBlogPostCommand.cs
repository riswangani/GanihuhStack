namespace GanihuhStack.Application.BlogPosts.Commands.UpdateBlogPost;

public record UpdateBlogPostCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Slug { get; init; }
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? Tags { get; init; }
    public bool IsPublished { get; init; }
}

public class UpdateBlogPostCommandValidator : AbstractValidator<UpdateBlogPostCommand>
{
    public UpdateBlogPostCommandValidator()
    {
        RuleFor(v => v.Title).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Slug).MaximumLength(200).Matches(@"^[a-z0-9-]+$")
            .When(v => v.Slug is not null);
        RuleFor(v => v.Content).NotEmpty();
        RuleFor(v => v.Excerpt).MaximumLength(500).When(v => v.Excerpt is not null);
    }
}

public class UpdateBlogPostCommandHandler : IRequestHandler<UpdateBlogPostCommand>
{
    private static readonly Action<ILogger, int, string, Exception?> LogUpdated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(2, "BlogPostUpdated"),
            "Blog post updated. Id: {Id}, Title: {Title}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateBlogPostCommandHandler> _logger;

    public UpdateBlogPostCommandHandler(IApplicationDbContext context, ILogger<UpdateBlogPostCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(UpdateBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = await _context.BlogPosts
            .FindAsync([request.Id], cancellationToken);

        // Guard.Against.NotFound → otomatis lempar NotFoundException → ProblemDetailsExceptionHandler tangkap → balik 404
        Guard.Against.NotFound(request.Id, blogPost);

        blogPost.Title = request.Title;
        blogPost.Slug = request.Slug ?? blogPost.Slug;
        blogPost.Content = request.Content;
        blogPost.Excerpt = request.Excerpt;
        blogPost.Tags = request.Tags;
        blogPost.IsPublished = request.IsPublished;

        if (request.IsPublished && blogPost.PublishedDate is null)
            blogPost.PublishedDate = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        LogUpdated(_logger, blogPost.Id, blogPost.Title, null);
    }
}
