namespace GanihuhStack.Application.NowStatuses.Commands.UpdateNowStatus;

public record UpdateNowStatusCommand : IRequest<int>
{
    public string CurrentFocus { get; init; } = string.Empty;
    public string? Details { get; init; }
    public string? CurrentlyReading { get; init; }
    public string? Mood { get; init; }
}

public class UpdateNowStatusCommandValidator : AbstractValidator<UpdateNowStatusCommand>
{
    public UpdateNowStatusCommandValidator()
    {
        RuleFor(v => v.CurrentFocus).NotEmpty().MaximumLength(300);
        RuleFor(v => v.CurrentlyReading).MaximumLength(300).When(v => v.CurrentlyReading is not null);
        RuleFor(v => v.Mood).MaximumLength(100).When(v => v.Mood is not null);
    }
}

public class UpdateNowStatusCommandHandler : IRequestHandler<UpdateNowStatusCommand, int>
{
    private static readonly Action<ILogger, int, string, Exception?> LogUpdated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(301, "NowStatusUpdated"),
            "Now status updated with a new entry. Id: {Id}, Focus: {Focus}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateNowStatusCommandHandler> _logger;

    public UpdateNowStatusCommandHandler(IApplicationDbContext context, ILogger<UpdateNowStatusCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> Handle(UpdateNowStatusCommand request, CancellationToken cancellationToken)
    {
        var nowStatus = new NowStatus
        {
            CurrentFocus = request.CurrentFocus,
            Details = request.Details,
            CurrentlyReading = request.CurrentlyReading,
            Mood = request.Mood
        };

        _context.NowStatuses.Add(nowStatus);
        await _context.SaveChangesAsync(cancellationToken);

        LogUpdated(_logger, nowStatus.Id, nowStatus.CurrentFocus, null);

        return nowStatus.Id;
    }
}
