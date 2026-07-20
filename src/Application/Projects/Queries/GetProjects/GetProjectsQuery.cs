namespace GanihuhStack.Application.Projects.Queries.GetProjects;

public class ProjectDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Technologies { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? DemoUrl { get; init; }
    public bool IsFeatured { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset LastModified { get; init; }

    private class Mapping : Profile
    {
        public Mapping() => CreateMap<Project, ProjectDto>();
    }
}

public record GetProjectsQuery : IRequest<List<ProjectDto>>;

public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, List<ProjectDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProjectsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ProjectDto>> Handle(
        GetProjectsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .Projects.OrderByDescending(p => p.Created)
            .ProjectTo<ProjectDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
