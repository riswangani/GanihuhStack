using GanihuhStack.Domain.Common;

namespace GanihuhStack.Domain.Entities.Skills;

public class Skill : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
}
