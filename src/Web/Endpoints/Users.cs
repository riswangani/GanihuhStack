using GanihuhStack.Infrastructure.Identity;

namespace GanihuhStack.Web.Endpoints;

public class Users : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapIdentityApi<ApplicationUser>();
    }
}
