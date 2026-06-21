using GanihuhStack.Application.Common.Interfaces;
using GanihuhStack.Infrastructure.Data;
using GanihuhStack.Infrastructure.Data.Interceptors;
using GanihuhStack.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString(Services.Database);
        
        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            if (string.IsNullOrEmpty(connectionString))
            {
                options.UseInMemoryDatabase("GanihuhStackDb");
            }
            else
            {
                options.UseNpgsql(connectionString);
            }
            options.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        });

        if (!string.IsNullOrEmpty(connectionString))
        {
            builder.EnrichNpgsqlDbContext<ApplicationDbContext>();
        }

        builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        // Policy scheme: pilih Bearer jika ada Authorization header, fallback ke Cookie
        const string MultiScheme = "BearerOrCookie";
        var authBuilder = builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme = MultiScheme;
            options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
        });
        authBuilder.AddPolicyScheme(MultiScheme, "Bearer or Cookie", opts =>
        {
            opts.ForwardDefaultSelector = ctx =>
            {
                var auth = ctx.Request.Headers.Authorization.FirstOrDefault();
                return auth?.StartsWith("Bearer ") == true
                    ? IdentityConstants.BearerScheme
                    : IdentityConstants.ApplicationScheme;
            };
        });
        authBuilder.AddBearerToken(IdentityConstants.BearerScheme);
        authBuilder.AddIdentityCookies();

        builder.Services.AddAuthorizationBuilder();

        builder.Services
            .AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders()
            .AddApiEndpoints();

        builder.Services.AddSingleton(TimeProvider.System);
        builder.Services.AddTransient<IIdentityService, IdentityService>();
    }
}
