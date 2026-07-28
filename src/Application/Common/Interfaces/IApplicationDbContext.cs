using GanihuhStack.Domain.Entities.BlogPosts;
using GanihuhStack.Domain.Entities.Identity;
using GanihuhStack.Domain.Entities.NowStatuses;
using GanihuhStack.Domain.Entities.Projects;

namespace GanihuhStack.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<BlogPost> BlogPosts { get; }
    DbSet<Project> Projects { get; }
    DbSet<NowStatus> NowStatuses { get; }
    DbSet<UserSession> UserSessions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
