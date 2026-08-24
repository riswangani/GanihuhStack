namespace GanihuhStack.Application.Skills.Commands.CreateSkill;

public record CreateSkillCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
}

public class CreateSkillCommandValidator : AbstractValidator<CreateSkillCommand>
{
    public CreateSkillCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreateSkillCommandHandler : IRequestHandler<CreateSkillCommand, int>
{
    private static readonly Action<ILogger, int, string, Exception?> LogCreated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(401, "SkillCreated"),
            "Skill created. Id: {Id}, Name: {Name}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateSkillCommandHandler> _logger;

    public CreateSkillCommandHandler(IApplicationDbContext context, ILogger<CreateSkillCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> Handle(CreateSkillCommand request, CancellationToken cancellationToken)
    {
        var skill = new Skill { Name = request.Name };

        _context.Skills.Add(skill);
        await _context.SaveChangesAsync(cancellationToken);

        LogCreated(_logger, skill.Id, skill.Name, null);

        return skill.Id;
    }
}
