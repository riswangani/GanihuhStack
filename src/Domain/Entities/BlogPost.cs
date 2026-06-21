using GanihuhStack.Domain.Common;

namespace GanihuhStack.Domain.Entities;

public class BlogPost : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Tags { get; set; }
    public bool IsPublished { get; set; }
    public DateTimeOffset? PublishedDate { get; set; }
}
