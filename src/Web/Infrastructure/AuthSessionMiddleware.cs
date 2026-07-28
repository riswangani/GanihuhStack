using System.Security.Claims;
using GanihuhStack.Application.Common.Interfaces;
using GanihuhStack.Domain.Entities.Identity;
using GanihuhStack.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace GanihuhStack.Web.Infrastructure;

public class AuthSessionMiddleware
{
    private readonly RequestDelegate _next;
    private const string AccessTokenCookie = "access_token";
    private const string RefreshTokenCookie = "refresh_token";

    public AuthSessionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        IApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IOptionsMonitor<BearerTokenOptions> bearerTokenOptions,
        TimeProvider timeProvider)
    {
        var options = bearerTokenOptions.Get(IdentityConstants.BearerScheme);
        var utcNow = timeProvider.GetUtcNow();

        // 1. Try extracting access token from Cookie or Authorization Header
        string? accessToken = context.Request.Cookies[AccessTokenCookie];
        if (string.IsNullOrEmpty(accessToken))
        {
            var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
            if (authHeader?.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) == true)
            {
                accessToken = authHeader.Substring("Bearer ".Length).Trim();
            }
        }

        // 2. Validate access_token
        if (!string.IsNullOrEmpty(accessToken))
        {
            try
            {
                var ticket = options.BearerTokenProtector.Unprotect(accessToken);
                if (ticket?.Properties?.ExpiresUtc is { } expiresUtc && utcNow < expiresUtc && ticket.Principal != null)
                {
                    context.User = ticket.Principal;
                }
            }
            catch
            {
                // Invalid access token — fall through to refresh check
            }
        }

        // 3. Fallback: If not authenticated, check refresh_token in DB (Rust middleware pattern)
        if (context.User.Identity?.IsAuthenticated != true)
        {
            string? refreshToken = context.Request.Cookies[RefreshTokenCookie];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var session = await dbContext.UserSessions
                    .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);

                if (session != null)
                {
                    if (session.ExpiresAt > utcNow)
                    {
                        var user = await userManager.FindByIdAsync(session.UserId);
                        if (user != null)
                        {
                            var principal = await signInManager.CreateUserPrincipalAsync(user);
                            context.User = principal;

                            // Create new access token and attach to response cookie automatically
                            var bearerProperties = new AuthenticationProperties
                            {
                                ExpiresUtc = utcNow + options.BearerTokenExpiration
                            };
                            var accessTokenTicket = new AuthenticationTicket(principal, bearerProperties, IdentityConstants.BearerScheme);
                            var newAccessToken = options.BearerTokenProtector.Protect(accessTokenTicket);

                            context.Response.Cookies.Append(AccessTokenCookie, newAccessToken, new CookieOptions
                            {
                                HttpOnly = false,
                                SameSite = SameSiteMode.Lax,
                                Path = "/",
                                Expires = bearerProperties.ExpiresUtc
                            });
                        }
                    }
                    else
                    {
                        // Session expired — remove from DB and clear cookie
                        dbContext.UserSessions.Remove(session);
                        await dbContext.SaveChangesAsync(CancellationToken.None);
                        context.Response.Cookies.Delete(AccessTokenCookie);
                        context.Response.Cookies.Delete(RefreshTokenCookie);
                    }
                }
            }
        }

        await _next(context);
    }
}
