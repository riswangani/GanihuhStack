using GanihuhStack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GanihuhStack.Infrastructure.Data.Configurations;

public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
{
    public void Configure(EntityTypeBuilder<BlogPost> builder)
    {
        builder.Property(b => b.Title).HasMaxLength(200).IsRequired();
        builder.Property(b => b.Slug).HasMaxLength(200).IsRequired();
        builder.Property(b => b.Tags).HasMaxLength(500);
        builder.Property(b => b.Excerpt).HasMaxLength(500);

        builder.HasIndex(b => b.Slug).IsUnique();
    }
}
