namespace GanihuhStack.Application.BlogPosts.Commands.CreateBlogPost;

// Command — data yang dikirim user untuk membuat blog post
public record CreateBlogPostCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? Tags { get; init; }
}

// Validator — validasi input sebelum handler dijalankan (otomatis via ValidationBehaviour)
public class CreateBlogPostCommandValidator : AbstractValidator<CreateBlogPostCommand>
{
    public CreateBlogPostCommandValidator()
    {
        RuleFor(v => v.Title).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Slug).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Content).NotEmpty();
        RuleFor(v => v.Excerpt).MaximumLength(500).When(v => v.Excerpt is not null);
    }
}

// Handler — logika bisnis: simpan ke database, kembalikan Id yang baru
public class CreateBlogPostCommandHandler : IRequestHandler<CreateBlogPostCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBlogPostCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = new BlogPost
        {
            Title = request.Title,
            Slug = request.Slug,
            Content = request.Content,
            Excerpt = request.Excerpt,
            Tags = request.Tags,
            IsPublished = false
        };

        _context.BlogPosts.Add(blogPost);
        await _context.SaveChangesAsync(cancellationToken);

        return blogPost.Id;
    }
}
