namespace GanihuhStack.Application.Skills.Queries.GetSkills;

public class SkillDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;

    private class Mapping : Profile
    {
        public Mapping() => CreateMap<Skill, SkillDto>();
    }
}

public record GetSkillsQuery : IRequest<List<SkillDto>>;

public class GetSkillsQueryHandler : IRequestHandler<GetSkillsQuery, List<SkillDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSkillsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<SkillDto>> Handle(GetSkillsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Skills
            .OrderBy(s => s.Created)
            .ProjectTo<SkillDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
