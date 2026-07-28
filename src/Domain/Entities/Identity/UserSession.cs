using GanihuhStack.Domain.Common;

namespace GanihuhStack.Domain.Entities.Identity;

public class UserSession : BaseEntity
{
    public required string UserId { get; set; }
    public required string RefreshToken { get; set; }
    public string? IpAddress { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
