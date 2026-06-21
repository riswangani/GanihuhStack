using GanihuhStack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GanihuhStack.Infrastructure.Data.Configurations;

public class NowStatusConfiguration : IEntityTypeConfiguration<NowStatus>
{
    public void Configure(EntityTypeBuilder<NowStatus> builder)
    {
        builder.Property(n => n.CurrentFocus).HasMaxLength(300).IsRequired();
        builder.Property(n => n.CurrentlyReading).HasMaxLength(300);
        builder.Property(n => n.Mood).HasMaxLength(100);
    }
}
