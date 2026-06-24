namespace GanihuhStack.Application.BlogPosts.Commands.CreateBlogPost;

public record CreateBlogPostCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? Tags { get; init; }
    public bool IsPublished { get; init; }
}

public class CreateBlogPostCommandValidator : AbstractValidator<CreateBlogPostCommand>
{
    public CreateBlogPostCommandValidator()
    {
        RuleFor(v => v.Title).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Content).NotEmpty();
        RuleFor(v => v.Excerpt).MaximumLength(500).When(v => v.Excerpt is not null);
    }
}

public class CreateBlogPostCommandHandler : IRequestHandler<CreateBlogPostCommand, int>
{
    private static readonly Action<ILogger, int, string, string, Exception?> LogCreated =
        LoggerMessage.Define<int, string, string>(
            LogLevel.Information,
            new EventId(1, "BlogPostCreated"),
            "Blog post created. Id: {Id}, Title: {Title}, Slug: {Slug}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateBlogPostCommandHandler> _logger;

    public CreateBlogPostCommandHandler(IApplicationDbContext context, ILogger<CreateBlogPostCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> Handle(CreateBlogPostCommand request, CancellationToken cancellationToken)
    {
        var baseSlug = BlogPost.GenerateSlug(request.Title);
        var slug = baseSlug;
        var suffix = 2;
        while (await _context.BlogPosts.AnyAsync(b => b.Slug == slug, cancellationToken))
            slug = $"{baseSlug}-{suffix++}";

        var blogPost = new BlogPost
        {
            Title = request.Title,
            Slug = slug,
            Content = request.Content,
            Excerpt = request.Excerpt,
            Tags = request.Tags,
            IsPublished = false
        };

        _context.BlogPosts.Add(blogPost);
        await _context.SaveChangesAsync(cancellationToken);

        LogCreated(_logger, blogPost.Id, blogPost.Title, blogPost.Slug, null);

        return blogPost.Id;
    }
}
