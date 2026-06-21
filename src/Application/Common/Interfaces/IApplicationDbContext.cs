using GanihuhStack.Domain.Entities;

namespace GanihuhStack.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<BlogPost> BlogPosts { get; }
    DbSet<Project> Projects { get; }
    DbSet<NowStatus> NowStatuses { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
