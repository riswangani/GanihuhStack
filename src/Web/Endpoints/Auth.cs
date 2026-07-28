using System.Security.Claims;
using GanihuhStack.Application.Common.Interfaces;
using GanihuhStack.Domain.Entities.Identity;
using GanihuhStack.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace GanihuhStack.Web.Endpoints;

public class Auth : IEndpointGroup
{
    private const string AccessTokenCookieName = "access_token";
    private const string RefreshTokenCookieName = "refresh_token";

    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(Login, "login");
        groupBuilder.MapPost(Refresh, "refresh");
        groupBuilder.MapPost(Logout, "logout");
        groupBuilder.MapGet(Me, "me");
    }

    public record LoginRequest(string Email, string Password);
    public record AuthResponse(string AccessToken, string TokenType, long ExpiresIn);
    public record UserDto(string Id, string Email, string? UserName);

    public static async Task<Results<Ok<AuthResponse>, UnauthorizedHttpResult>> Login(
        [FromBody] LoginRequest request,
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        IApplicationDbContext dbContext,
        IOptionsMonitor<BearerTokenOptions> bearerTokenOptions,
        TimeProvider timeProvider,
        HttpContext httpContext)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null) return TypedResults.Unauthorized();

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!result.Succeeded) return TypedResults.Unauthorized();

        var principal = await signInManager.CreateUserPrincipalAsync(user);
        var options = bearerTokenOptions.Get(IdentityConstants.BearerScheme);
        var utcNow = timeProvider.GetUtcNow();

        // Access Token (15 min)
        var bearerProperties = new AuthenticationProperties { ExpiresUtc = utcNow + options.BearerTokenExpiration };
        var accessToken = options.BearerTokenProtector.Protect(
            new AuthenticationTicket(principal, bearerProperties, IdentityConstants.BearerScheme));

        // Refresh Token Session di Database (7 hari)
        var refreshToken = Guid.NewGuid().ToString("N");
        var refreshExpiresAt = utcNow.AddDays(7);

        dbContext.UserSessions.Add(new UserSession
        {
            UserId = user.Id,
            RefreshToken = refreshToken,
            IpAddress = httpContext.Connection.RemoteIpAddress?.ToString(),
            ExpiresAt = refreshExpiresAt,
            CreatedAt = utcNow
        });
        await dbContext.SaveChangesAsync(CancellationToken.None);

        // Cookies
        httpContext.Response.Cookies.Append(AccessTokenCookieName, accessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = httpContext.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = bearerProperties.ExpiresUtc,
            Path = "/"
        });

        httpContext.Response.Cookies.Append(RefreshTokenCookieName, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = httpContext.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = refreshExpiresAt,
            Path = "/"
        });

        return TypedResults.Ok(new AuthResponse(accessToken, "Bearer", (long)options.BearerTokenExpiration.TotalSeconds));
    }

    public static async Task<Results<Ok<AuthResponse>, UnauthorizedHttpResult>> Refresh(
        IApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IOptionsMonitor<BearerTokenOptions> bearerTokenOptions,
        TimeProvider timeProvider,
        HttpContext httpContext)
    {
        if (!httpContext.Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) || string.IsNullOrEmpty(refreshToken))
        {
            return TypedResults.Unauthorized();
        }

        var session = await dbContext.UserSessions.FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);
        var utcNow = timeProvider.GetUtcNow();

        if (session == null || session.ExpiresAt <= utcNow)
        {
            if (session != null)
            {
                dbContext.UserSessions.Remove(session);
                await dbContext.SaveChangesAsync(CancellationToken.None);
            }
            httpContext.Response.Cookies.Delete(AccessTokenCookieName);
            httpContext.Response.Cookies.Delete(RefreshTokenCookieName);
            return TypedResults.Unauthorized();
        }

        var user = await userManager.FindByIdAsync(session.UserId);
        if (user == null) return TypedResults.Unauthorized();

        var principal = await signInManager.CreateUserPrincipalAsync(user);
        var options = bearerTokenOptions.Get(IdentityConstants.BearerScheme);

        var bearerProperties = new AuthenticationProperties { ExpiresUtc = utcNow + options.BearerTokenExpiration };
        var newAccessToken = options.BearerTokenProtector.Protect(
            new AuthenticationTicket(principal, bearerProperties, IdentityConstants.BearerScheme));

        session.RefreshToken = Guid.NewGuid().ToString("N");
        session.ExpiresAt = utcNow.AddDays(7);
        await dbContext.SaveChangesAsync(CancellationToken.None);

        httpContext.Response.Cookies.Append(AccessTokenCookieName, newAccessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = httpContext.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = bearerProperties.ExpiresUtc,
            Path = "/"
        });

        httpContext.Response.Cookies.Append(RefreshTokenCookieName, session.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = httpContext.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = session.ExpiresAt,
            Path = "/"
        });

        return TypedResults.Ok(new AuthResponse(newAccessToken, "Bearer", (long)options.BearerTokenExpiration.TotalSeconds));
    }

    public static async Task<Ok> Logout(
        IApplicationDbContext dbContext,
        SignInManager<ApplicationUser> signInManager,
        HttpContext httpContext)
    {
        if (httpContext.Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) && !string.IsNullOrEmpty(refreshToken))
        {
            var session = await dbContext.UserSessions.FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);
            if (session != null)
            {
                dbContext.UserSessions.Remove(session);
                await dbContext.SaveChangesAsync(CancellationToken.None);
            }
        }

        httpContext.Response.Cookies.Delete(AccessTokenCookieName);
        httpContext.Response.Cookies.Delete(RefreshTokenCookieName);
        await signInManager.SignOutAsync();
        return TypedResults.Ok();
    }

    public static Results<Ok<UserDto>, UnauthorizedHttpResult> Me(HttpContext httpContext)
    {
        if (httpContext.User.Identity?.IsAuthenticated != true)
        {
            return TypedResults.Unauthorized();
        }

        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var email = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var userName = httpContext.User.Identity.Name;

        return TypedResults.Ok(new UserDto(userId, email, userName));
    }
}
