namespace GanihuhStack.Application.BlogPosts.Queries.GetBlogPosts;

// DTO (Data Transfer Object) — Data yang dikirim balik ke client/frontend (bukan entitas database langsung untuk keamanan & efisiensi)
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

    // AutoMapper Profile: Mengatur pemetaan otomatis dari entitas domain 'BlogPost' ke 'BlogPostDto'
    private class Mapping : Profile
    {
        public Mapping() => CreateMap<BlogPost, BlogPostDto>();
    }
}

// 1. Query — "Pesan/Intruksi" yang dikirim ke MediatR (IRequest<List<BlogPostDto>> memberitahu MediatR bahwa hasil akhirnya adalah List<BlogPostDto>)
public record GetBlogPostsQuery : IRequest<List<BlogPostDto>>;

// 2. Handler — Kelas yang secara otomatis dipanggil oleh MediatR saat GetBlogPostsQuery dikirim via _sender.Send(...)
// Interface IRequestHandler<GetBlogPostsQuery, List<BlogPostDto>> mewajibkan penggunaan nama method 'Handle'
public class GetBlogPostsQueryHandler : IRequestHandler<GetBlogPostsQuery, List<BlogPostDto>>
{
    private readonly IApplicationDbContext _context; // Abstraksi EF Core Database Context
    private readonly IMapper _mapper; // Service AutoMapper untuk proyeksi DTO

    public GetBlogPostsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Method Handle: Di sinilah EF Core mengeksekusi query ke database PostgreSQL
    public async Task<List<BlogPostDto>> Handle(GetBlogPostsQuery request, CancellationToken cancellationToken)
    {
        // _context.BlogPosts = DbSet milik EF Core
        // .OrderByDescending = Pengurutan data (ORDER BY Created DESC)
        // .ProjectTo = AutoMapper mengubah Expression Tree LINQ menjadi SELECT kolom DTO secara efisien di level SQL
        // .ToListAsync = EF Core mengirim SQL SELECT ke Database & mengembalikan List<BlogPostDto> secara asynchronous
        return await _context.BlogPosts
            .OrderByDescending(b => b.Created)
            .ProjectTo<BlogPostDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
