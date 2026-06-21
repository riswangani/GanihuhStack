using GanihuhStack.Domain.Common;

namespace GanihuhStack.Domain.Entities;

public class NowStatus : BaseAuditableEntity
{
    public string CurrentFocus { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? CurrentlyReading { get; set; }
    public string? Mood { get; set; }
}
