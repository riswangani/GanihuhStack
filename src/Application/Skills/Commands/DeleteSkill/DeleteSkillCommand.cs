namespace GanihuhStack.Application.Skills.Commands.DeleteSkill;

public record DeleteSkillCommand(int Id) : IRequest;

public class DeleteSkillCommandHandler : IRequestHandler<DeleteSkillCommand>
{
    private static readonly Action<ILogger, int, Exception?> LogDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            new EventId(402, "SkillDeleted"),
            "Skill deleted. Id: {Id}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteSkillCommandHandler> _logger;

    public DeleteSkillCommandHandler(IApplicationDbContext context, ILogger<DeleteSkillCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(DeleteSkillCommand request, CancellationToken cancellationToken)
    {
        var skill = await _context.Skills.FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, skill);

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync(cancellationToken);

        LogDeleted(_logger, request.Id, null);
    }
}
