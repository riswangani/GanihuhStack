using GanihuhStack.Application.BlogPosts.Queries.GetBlogPosts;

namespace GanihuhStack.Application.BlogPosts.Queries.GetBlogPostBySlug;

public record GetBlogPostBySlugQuery(string Slug) : IRequest<BlogPostDto>;

public class GetBlogPostBySlugQueryHandler : IRequestHandler<GetBlogPostBySlugQuery, BlogPostDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBlogPostBySlugQueryHandler(IApplicationDbContext context, IMapper mapper)
        => (_context, _mapper) = (context, mapper);

    public async Task<BlogPostDto> Handle(GetBlogPostBySlugQuery request, CancellationToken cancellationToken)
    {
        var post = await _context.BlogPosts
            .Where(b => b.Slug == request.Slug)
            .ProjectTo<BlogPostDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.Slug, post);
        return post;
    }
}
