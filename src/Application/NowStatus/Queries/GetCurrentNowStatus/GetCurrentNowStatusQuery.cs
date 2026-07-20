namespace GanihuhStack.Application.NowStatuses.Queries.GetCurrentNowStatus;

public class NowStatusDto
{
    public int Id { get; init; }
    public string CurrentFocus { get; init; } = string.Empty;
    public string? Details { get; init; }
    public string? CurrentlyReading { get; init; }
    public string? Mood { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset LastModified { get; init; }

    private class Mapping : Profile
    {
        public Mapping() => CreateMap<NowStatus, NowStatusDto>();
    }
}

public record GetCurrentNowStatusQuery : IRequest<NowStatusDto?>;

public class GetCurrentNowStatusQueryHandler : IRequestHandler<GetCurrentNowStatusQuery, NowStatusDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCurrentNowStatusQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<NowStatusDto?> Handle(GetCurrentNowStatusQuery request, CancellationToken cancellationToken)
    {
        return await _context.NowStatuses
            .OrderByDescending(n => n.Created)
            .ProjectTo<NowStatusDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
