namespace GanihuhStack.Application.Projects.Commands.CreateProject;

public record CreateProjectCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Technologies { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? DemoUrl { get; init; }
    public bool IsFeatured { get; init; }
}

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Technologies).MaximumLength(500).When(v => v.Technologies is not null);
        RuleFor(v => v.RepositoryUrl).MaximumLength(500).When(v => v.RepositoryUrl is not null);
        RuleFor(v => v.DemoUrl).MaximumLength(500).When(v => v.DemoUrl is not null);
    }
}

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, int>
{
    private static readonly Action<ILogger, int, string, Exception?> LogCreated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(201, "ProjectCreated"),
            "Project created. Id: {Id}, Name: {Name}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateProjectCommandHandler> _logger;

    public CreateProjectCommandHandler(IApplicationDbContext context, ILogger<CreateProjectCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Technologies = request.Technologies,
            RepositoryUrl = request.RepositoryUrl,
            DemoUrl = request.DemoUrl,
            IsFeatured = request.IsFeatured
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(cancellationToken);

        LogCreated(_logger, project.Id, project.Name, null);

        return project.Id;
    }
}
