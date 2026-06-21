namespace GanihuhStack.Application.BlogPosts.Queries.GetBlogPosts;

// DTO — data yang dikirim balik ke client (bukan entity langsung)
public class BlogPostDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? Tags { get; init; }
    public bool IsPublished { get; init; }
    public DateTimeOffset? PublishedDate { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset LastModified { get; init; }

    // AutoMapper: petakan dari BlogPost (entity) ke BlogPostDto
    private class Mapping : Profile
    {
        public Mapping() => CreateMap<BlogPost, BlogPostDto>();
    }
}

// Query — "pesan" yang dikirim ke MediatR: "tolong ambilkan semua blog posts"
public record GetBlogPostsQuery : IRequest<List<BlogPostDto>>;

// Handler — yang benar-benar ngerjain query-nya
public class GetBlogPostsQueryHandler : IRequestHandler<GetBlogPostsQuery, List<BlogPostDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBlogPostsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BlogPostDto>> Handle(GetBlogPostsQuery request, CancellationToken cancellationToken)
    {
        return await _context.BlogPosts
            .OrderByDescending(b => b.Created)
            .ProjectTo<BlogPostDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
