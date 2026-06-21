using GanihuhStack.Domain.Common;

namespace GanihuhStack.Domain.Entities;

public class Project : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Technologies { get; set; }
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; }
}
