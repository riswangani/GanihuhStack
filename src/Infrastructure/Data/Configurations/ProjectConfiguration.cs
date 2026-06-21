using GanihuhStack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GanihuhStack.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Technologies).HasMaxLength(500);
        builder.Property(p => p.RepositoryUrl).HasMaxLength(500);
        builder.Property(p => p.DemoUrl).HasMaxLength(500);
    }
}
