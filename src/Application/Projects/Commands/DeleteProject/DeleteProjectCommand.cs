namespace GanihuhStack.Application.Projects.Commands.DeleteProject;

public record DeleteProjectCommand(int Id) : IRequest;

public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand>
{
    private static readonly Action<ILogger, int, Exception?> LogDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            new EventId(203, "ProjectDeleted"),
            "Project deleted. Id: {Id}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteProjectCommandHandler> _logger;

    public DeleteProjectCommandHandler(IApplicationDbContext context, ILogger<DeleteProjectCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _context.Projects.FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, project);

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync(cancellationToken);

        LogDeleted(_logger, request.Id, null);
    }
}
