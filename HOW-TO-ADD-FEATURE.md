# Cara Tambah Fitur CRUD Baru

Panduan ini menggunakan **Projects** sebagai contoh.
Untuk fitur lain (NowStatus, dll) tinggal ganti nama dan fields-nya.

---

## Urutan Pengerjaan

```
1. Domain       → bikin Entity
2. Infrastructure → EF Config + daftarkan ke DbContext + Migration
3. Application  → Query + Commands (Create, Update, Delete)
4. Web          → Endpoint + daftarkan route
5. Frontend     → Service (TS) + UI di Dashboard
```

---

## 1. Domain — Entity

**File:** `src/Domain/Entities/Project.cs`

```csharp
public class Project : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Technologies { get; set; }
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; }
}
```

> `BaseAuditableEntity` sudah bawain `Id`, `Created`, `LastModified` — tidak perlu dideklarasi ulang.

---

## 2. Infrastructure

### A. EF Configuration

**File:** `src/Infrastructure/Data/Configurations/ProjectConfiguration.cs`

```csharp
public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Description).IsRequired();
        builder.Property(p => p.Technologies).HasMaxLength(500);
        builder.Property(p => p.RepositoryUrl).HasMaxLength(500);
        builder.Property(p => p.DemoUrl).HasMaxLength(500);
    }
}
```

### B. Daftarkan ke DbContext

**File:** `src/Infrastructure/Data/ApplicationDbContext.cs`

```csharp
public DbSet<Project> Projects => Set<Project>();
```

### C. Daftarkan ke Interface

**File:** `src/Application/Common/Interfaces/IApplicationDbContext.cs`

```csharp
DbSet<Project> Projects { get; }
```

### D. Jalankan Migration

```bash
dotnet ef migrations add AddProjects --project src/Infrastructure --startup-project src/Web
dotnet ef database update --project src/Infrastructure --startup-project src/Web
```

---

## 3. Application — CQRS

Struktur folder:
```
src/Application/Projects/
├── Commands/
│   ├── CreateProject/CreateProjectCommand.cs
│   ├── UpdateProject/UpdateProjectCommand.cs
│   └── DeleteProject/DeleteProjectCommand.cs
└── Queries/
    └── GetProjects/GetProjectsQuery.cs
```

### A. Query

**File:** `src/Application/Projects/Queries/GetProjects/GetProjectsQuery.cs`

```csharp
public record GetProjectsQuery : IRequest<List<ProjectDto>>;

public record ProjectDto(
    int Id, string Name, string Description,
    string? Technologies, string? RepositoryUrl,
    string? DemoUrl, bool IsFeatured
);

public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, List<ProjectDto>>
{
    private readonly IApplicationDbContext _context;
    public GetProjectsQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken ct)
        => await _context.Projects
            .Select(p => new ProjectDto(
                p.Id, p.Name, p.Description,
                p.Technologies, p.RepositoryUrl, p.DemoUrl, p.IsFeatured))
            .ToListAsync(ct);
}
```

### B. Command Create

**File:** `src/Application/Projects/Commands/CreateProject/CreateProjectCommand.cs`

```csharp
public record CreateProjectCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Technologies { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? DemoUrl { get; init; }
}

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Description).NotEmpty();
    }
}

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, int>
{
    private static readonly Action<ILogger, int, string, Exception?> LogCreated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(1, "ProjectCreated"),
            "Project created. Id: {Id}, Name: {Name}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateProjectCommandHandler> _logger;

    public CreateProjectCommandHandler(
        IApplicationDbContext context,
        ILogger<CreateProjectCommandHandler> logger)
        => (_context, _logger) = (context, logger);

    public async Task<int> Handle(CreateProjectCommand request, CancellationToken ct)
    {
        var project = new Project
        {
            Name        = request.Name,
            Description = request.Description,
            Technologies  = request.Technologies,
            RepositoryUrl = request.RepositoryUrl,
            DemoUrl       = request.DemoUrl,
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(ct);

        LogCreated(_logger, project.Id, project.Name, null);
        return project.Id;
    }
}
```

### C. Command Update

**File:** `src/Application/Projects/Commands/UpdateProject/UpdateProjectCommand.cs`

```csharp
public record UpdateProjectCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? Technologies { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? DemoUrl { get; init; }
    public bool IsFeatured { get; init; }
}

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Description).NotEmpty();
    }
}

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand>
{
    private static readonly Action<ILogger, int, string, Exception?> LogUpdated =
        LoggerMessage.Define<int, string>(
            LogLevel.Information,
            new EventId(2, "ProjectUpdated"),
            "Project updated. Id: {Id}, Name: {Name}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateProjectCommandHandler> _logger;

    public UpdateProjectCommandHandler(
        IApplicationDbContext context,
        ILogger<UpdateProjectCommandHandler> logger)
        => (_context, _logger) = (context, logger);

    public async Task Handle(UpdateProjectCommand request, CancellationToken ct)
    {
        var project = await _context.Projects.FindAsync([request.Id], ct);
        Guard.Against.NotFound(request.Id, project);

        project.Name          = request.Name;
        project.Description   = request.Description;
        project.Technologies  = request.Technologies;
        project.RepositoryUrl = request.RepositoryUrl;
        project.DemoUrl       = request.DemoUrl;
        project.IsFeatured    = request.IsFeatured;

        await _context.SaveChangesAsync(ct);
        LogUpdated(_logger, project.Id, project.Name, null);
    }
}
```

### D. Command Delete

**File:** `src/Application/Projects/Commands/DeleteProject/DeleteProjectCommand.cs`

```csharp
public record DeleteProjectCommand(int Id) : IRequest;

public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand>
{
    private static readonly Action<ILogger, int, Exception?> LogDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            new EventId(3, "ProjectDeleted"),
            "Project deleted. Id: {Id}");

    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteProjectCommandHandler> _logger;

    public DeleteProjectCommandHandler(
        IApplicationDbContext context,
        ILogger<DeleteProjectCommandHandler> logger)
        => (_context, _logger) = (context, logger);

    public async Task Handle(DeleteProjectCommand request, CancellationToken ct)
    {
        var project = await _context.Projects.FindAsync([request.Id], ct);
        Guard.Against.NotFound(request.Id, project);

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync(ct);

        LogDeleted(_logger, request.Id, null);
    }
}
```

---

## 4. Web — Endpoint

**File:** `src/Web/Endpoints/Projects.cs`

```csharp
public class Projects : IEndpointGroup
{
    public static void Map(RouteGroupBuilder group)
    {
        group.MapGet(GetProjects);
        group.MapPost(CreateProject).RequireAuthorization();
        group.MapPut(UpdateProject, "{id}").RequireAuthorization();
        group.MapDelete(DeleteProject, "{id}").RequireAuthorization();
    }

    public static async Task<Ok<List<ProjectDto>>> GetProjects(ISender sender)
        => TypedResults.Ok(await sender.Send(new GetProjectsQuery()));

    public static async Task<Created<AckDto>> CreateProject(CreateProjectCommand cmd, ISender sender)
    {
        var id = await sender.Send(cmd);
        return TypedResults.Created($"/api/projects/{id}", new AckDto("Project created successfully.", id));
    }

    public static async Task<Ok<AckDto>> UpdateProject(int id, UpdateProjectCommand cmd, ISender sender)
    {
        await sender.Send(cmd with { Id = id });
        return TypedResults.Ok(new AckDto("Project updated successfully.", id));
    }

    public static async Task<Ok<AckDto>> DeleteProject(int id, ISender sender)
    {
        await sender.Send(new DeleteProjectCommand(id));
        return TypedResults.Ok(new AckDto("Project deleted successfully.", id));
    }
}
```

### Daftarkan route

Cek `src/Web/Infrastructure/WebApplicationExtensions.cs` — lihat cara `BlogPosts` didaftarkan, ikutin cara yang sama untuk `Projects`.

---

## 5. Frontend

### A. Service

**File:** `src/Web/ClientApp/src/services/projects.ts`

```ts
import apiFetch from './api'
import type { AckDto } from './blogPosts'

export interface ProjectDto {
  id: number
  name: string
  description: string
  technologies: string | null
  repositoryUrl: string | null
  demoUrl: string | null
  isFeatured: boolean
}

export interface CreateProjectRequest {
  name: string
  description: string
  technologies?: string
  repositoryUrl?: string
  demoUrl?: string
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  isFeatured: boolean
}

export const getProjects   = () => apiFetch<ProjectDto[]>('/api/projects')
export const createProject = (data: CreateProjectRequest) =>
  apiFetch<AckDto>('/api/projects', { method: 'POST', body: JSON.stringify(data) })
export const updateProject = (id: number, data: UpdateProjectRequest) =>
  apiFetch<AckDto>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProject = (id: number) =>
  apiFetch<AckDto>(`/api/projects/${id}`, { method: 'DELETE' })
```

### B. UI di Dashboard

Ikutin pola `DashboardPage.tsx` yang sudah ada:

```tsx
// 1. import service functions
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projects'

// 2. useQuery untuk fetch
const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects })

// 3. useMutation untuk create/update/delete
const createMut = useMutation({ mutationFn: createProject, onSuccess: invalidate })

// 4. Form + list — ikutin struktur BlogSection di DashboardPage
```

---

## Checklist per Fitur

```
[ ] Entity di Domain
[ ] EF Configuration di Infrastructure
[ ] DbSet di ApplicationDbContext
[ ] DbSet di IApplicationDbContext
[ ] Migration dijalankan
[ ] GetQuery + DTO
[ ] CreateCommand + Validator + Handler
[ ] UpdateCommand + Validator + Handler
[ ] DeleteCommand + Handler
[ ] Endpoint (Get/Post/Put/Delete)
[ ] Endpoint didaftarkan di WebApplicationExtensions
[ ] Service functions (TS)
[ ] UI di Dashboard (form + list)
```
