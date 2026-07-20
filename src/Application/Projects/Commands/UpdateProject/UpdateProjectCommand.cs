namespace GanihuhStack.Application.Projects.Commands.UpdateProject;

public record UpdateProjectCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Technologies { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? DemoUrl { get; init; }
    public bool IsFeatured { get; init; }
}

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Technologies).MaximumLength(500).When(v => v.Technologies is not null);
        RuleFor(v => v.RepositoryUrl).MaximumLength(500).When(v => v.RepositoryUrl is not null);
        RuleFor(v => v.DemoUrl).MaximumLength(500).When(v => v.DemoUrl is not null);
    }
}

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand>
{
    private static readonly Action<ILogger, int, string, Exception?> LogUpdated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(202, "ProjectUpdated"),
            "Project updated. Id: {Id}, Name: {Name}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateProjectCommandHandler> _logger;

    public UpdateProjectCommandHandler(
        IApplicationDbContext context,
        ILogger<UpdateProjectCommandHandler> logger
    )
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _context.Projects.FindAsync([request.Id], cancellationToken);

        Guard.Against.NotFound(request.Id, project);

        project.Name = request.Name;
        project.Description = request.Description;
        project.Technologies = request.Technologies;
        project.RepositoryUrl = request.RepositoryUrl;
        project.DemoUrl = request.DemoUrl;
        project.IsFeatured = request.IsFeatured;

        await _context.SaveChangesAsync(cancellationToken);

        LogUpdated(_logger, project.Id, project.Name, null);
    }
}
