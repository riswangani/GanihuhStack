# MediatR di GanihuhStack

MediatR adalah library yang jadi **perantara** antara yang kirim request (endpoint)
dan yang handle request (handler). Endpoint tidak tahu handler ada, handler tidak tahu
endpoint ada — MediatR yang nyambungkan keduanya.

---

## 1. Registrasi

**File:** `src/Application/DependencyInjection.cs`

```csharp
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
    cfg.AddOpenRequestPreProcessor(typeof(LoggingBehaviour<>));
    cfg.AddOpenBehavior(typeof(UnhandledExceptionBehaviour<,>));
    cfg.AddOpenBehavior(typeof(AuthorizationBehaviour<,>));
    cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
    cfg.AddOpenBehavior(typeof(PerformanceBehaviour<,>));
});
```

`RegisterServicesFromAssembly` — MediatR scan seluruh assembly Application, cari semua
class yang implements `IRequestHandler<,>`, lalu register otomatis ke DI container.
**Tidak perlu daftarkan satu per satu** — bikin handler baru, langsung terdaftar.

---

## 2. Dipanggil di Program.cs

**File:** `src/Web/Program.cs`

```csharp
builder.AddApplicationServices(); // ← ini yang panggil AddMediatR di atas
```

Satu baris ini mendaftarkan seluruh MediatR + semua handlers + semua behaviours
ke ASP.NET DI container.

---

## 3. Endpoint auto-discovery

**File:** `src/Web/Infrastructure/WebApplicationExtensions.cs`

```csharp
app.MapEndpoints(typeof(Program).Assembly);
```

`MapEndpoints` scan semua class yang implements `IEndpointGroup` di assembly Web,
lalu register route-nya otomatis. Jadi ketika bikin `Projects.cs` yang implements
`IEndpointGroup`, route `/api/projects` langsung terdaftar tanpa perlu daftarkan
manual di `Program.cs`.

---

## 4. Pemakaian — ISender

`ISender` adalah interface dari MediatR untuk mengirim request ke handler.

```csharp
// Endpoint kirim command/query lewat ISender
public static async Task<Created<AckDto>> CreateBlogPost(
    CreateBlogPostCommand command,
    ISender sender)           // ← di-inject otomatis oleh ASP.NET DI
{
    var id = await sender.Send(command); // ← MediatR cari handler yang cocok
    return TypedResults.Created(...);
}
```

Di balik layar, `sender.Send(command)` melakukan ini:

```
sender.Send(CreateBlogPostCommand)
    ↓
MediatR lihat type → CreateBlogPostCommand
    ↓
Cari di registry → CreateBlogPostCommandHandler
    ↓
Jalankan pipeline (Logging → Validation → Performance)
    ↓
Jalankan CreateBlogPostCommandHandler.Handle()
    ↓
Return hasil
```

---

## 5. Pipeline Behaviours

Setiap request lewat pipeline ini **sebelum** sampai ke handler.
Didaftarkan di `DependencyInjection.cs`, berlaku untuk semua Command dan Query
tanpa perlu nulis manual di tiap handler.

```
Request masuk
    ↓
LoggingBehaviour            → log nama request + user yang kirim
    ↓                          "GanihuhStack Request: CreateBlogPostCommand {userId}"
UnhandledExceptionBehaviour → tangkap exception tak terduga, log error
    ↓
AuthorizationBehaviour      → cek apakah user punya permission
    ↓
ValidationBehaviour         → jalankan FluentValidation
    ↓                          kalau gagal → throw ValidationException → 400
Handler                     → business logic jalan
    ↓
PerformanceBehaviour        → kalau handler > 500ms → log warning
    ↓
Response keluar
```

Ini yang membuat setiap handler "gratis" dapat logging, validation, dan
performance monitoring tanpa nulis satu baris pun di handler-nya.

---

## 6. Alur Lengkap — dari HTTP sampai Database

```
Program.cs
└── builder.AddApplicationServices()
        └── AddMediatR(scan Assembly)
                ├── temukan semua IRequestHandler → daftarkan ke DI
                └── daftarkan semua Behaviour ke pipeline

HTTP POST /api/blogposts
    ↓
BlogPosts.cs → sender.Send(CreateBlogPostCommand)
    ↓
MediatR Pipeline:
    LoggingBehaviour      → log request + user
    ValidationBehaviour   → validasi, throw kalau gagal
    PerformanceBehaviour  → timer mulai
    ↓
CreateBlogPostCommandHandler.Handle()
    → generate slug
    → simpan ke DB via IApplicationDbContext
    → log sukses
    → return id
    ↓
PerformanceBehaviour      → timer berhenti, log kalau > 500ms
    ↓
BlogPosts.cs → return 201 Created + AckDto
    ↓
HTTP Response ke client
```

---

## Ringkasan

| Komponen | File | Fungsi |
|---|---|---|
| `AddMediatR()` | `Application/DependencyInjection.cs` | Register semua handler + behaviour |
| `AddApplicationServices()` | `Web/Program.cs` | Entry point registrasi |
| `MapEndpoints()` | `Web/Program.cs` | Auto-discover semua endpoint |
| `ISender` | Di setiap endpoint | Kirim Command/Query ke handler |
| `IRequest<T>` | Command/Query class | Tandai ini adalah MediatR request |
| `IRequestHandler<,>` | Handler class | Tandai ini adalah MediatR handler |
| `IPipelineBehavior<,>` | Behaviour class | Cross-cutting concerns |

**Intinya:** endpoint tidak tahu handler, handler tidak tahu endpoint.
MediatR yang jadi perantara — koneksinya otomatis lewat interface `IRequest` + `IRequestHandler`.
