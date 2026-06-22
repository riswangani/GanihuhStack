# GanihuhStack

Personal software engineering platform — portfolio website, technical blog, and knowledge management system built as a long-term engineering laboratory.

The business domain stays intentionally simple (blog posts, projects, a "what I'm doing now" page). The complexity that's allowed to grow is **engineering practice** — architecture, testing, CI/CD, observability.

---

## Tech Stack

### Backend

- **ASP.NET Core** — Minimal API (REST only)
- **Clean Architecture** — Jason Taylor template
- **CQRS** — MediatR
- **Validation** — FluentValidation
- **ORM** — Entity Framework Core + PostgreSQL

### Frontend

- **React 19** + TypeScript (strict mode)
- **Vite** + React Router
- **TanStack Query** — server state management
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component primitives (admin area)

### Infrastructure

- **.NET Aspire** — local dev orchestration
- **PostgreSQL** — primary database
- **GitHub Actions** — CI/CD _(coming soon)_
- **Azure Container Apps** — production hosting _(coming soon)_

---

## Architecture

This project uses **Clean Architecture** combined with **CQRS** pattern.

### Clean Architecture

> Business logic must not depend on frameworks, databases, or UI.

```
┌─────────────────────────────────┐
│           Web (UI/API)          │  ← HTTP endpoints, request/response shaping
│  ┌───────────────────────────┐  │
│  │      Infrastructure       │  │  ← EF Core, PostgreSQL, external services
│  │  ┌─────────────────────┐  │  │
│  │  │     Application     │  │  │  ← business logic, CQRS handlers
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │    Domain     │  │  │  │  ← entities, pure business rules
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Dependency rule — arrows point inward only:**

```
Web → Application → Domain
Infrastructure → Application → Domain
```

| Layer          | Location              | Responsibility                                          |
| -------------- | --------------------- | ------------------------------------------------------- |
| Domain         | `src/Domain/`         | Entities, pure business rules, no external dependencies |
| Application    | `src/Application/`    | CQRS handlers, validation, interfaces                   |
| Infrastructure | `src/Infrastructure/` | EF Core, PostgreSQL, external services                  |
| Web            | `src/Web/`            | Minimal API endpoints, HTTP concerns                    |

### CQRS

> Separate operations that change data (Command) from operations that read data (Query).

```
Command → mutates state, returns id or void
Query   → reads state, changes nothing
```

Every feature is organized by entity under `Application/`:

```
Application/
├── BlogPosts/
│   ├── Commands/
│   │   ├── CreateBlogPost/   ← CreateBlogPostCommand + Validator + Handler
│   │   ├── UpdateBlogPost/   ← UpdateBlogPostCommand + Validator + Handler
│   │   └── DeleteBlogPost/   ← DeleteBlogPostCommand + Handler
│   └── Queries/
│       └── GetBlogPosts/     ← GetBlogPostsQuery + Handler + DTO
├── Projects/
└── NowStatus/
```

### MediatR Pipeline

Every command and query passes through this pipeline automatically:

```
Request
  → LoggingBehaviour          (log request + user)
  → UnhandledExceptionBehaviour (catch unexpected errors)
  → AuthorizationBehaviour    (permission check)
  → ValidationBehaviour       (FluentValidation, throws 400 if invalid)
  → Handler                   (business logic)
  → PerformanceBehaviour      (warn if > 500ms)
```

---

## Solution Structure

```
GanihuhStack/
├── src/
│   ├── AppHost/          # .NET Aspire orchestrator — entry point for local dev
│   ├── ServiceDefaults/  # Shared Aspire config (telemetry, health, resilience)
│   ├── Domain/           # Entities, Value Objects, Domain Events
│   ├── Application/      # CQRS handlers, validators, interfaces, DTOs
│   ├── Infrastructure/   # EF Core, Identity, external services
│   ├── Web/              # Minimal API endpoints
│   │   └── ClientApp/    # React + Vite frontend
│   └── Shared/           # Shared constants across AppHost + Infrastructure
└── tests/
    ├── Domain.UnitTests/
    ├── Application.UnitTests/
    ├── Application.FunctionalTests/
    ├── Infrastructure.IntegrationTests/
    └── Web.AcceptanceTests/
```

---

## Running Locally

Prerequisites: [.NET 10 SDK](https://dotnet.microsoft.com/download), [Node.js 20+](https://nodejs.org/), [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling)

```bash
# Install Aspire workload (first time only)
dotnet workload install aspire

# Install frontend dependencies
cd src/Web/ClientApp
npm install

# Run everything via Aspire AppHost
cd ../../..
dotnet run --project src/AppHost
```

Aspire will start the Web API, React frontend, and PostgreSQL automatically.
Open the Aspire dashboard to see all services and logs.

---

## Roadmap

### Phase 1 — MVP _(in progress)_

- [x] Project setup (Clean Architecture + React + Vite)
- [x] .NET Aspire orchestration
- [x] Authentication
- [x] Blog CRUD (backend + public page + dashboard)
- [ ] Projects CRUD
- [ ] Now-status CRUD
- [ ] Remaining public pages (Now, Projects, About, Contact)

### Phase 2 — Containerization & Production Config

### Phase 3 — CI/CD (GitHub Actions)

### Phase 4 — Cloud Deployment (Azure Container Apps)

### Phase 5 — Observability (OpenTelemetry, Prometheus, Grafana)

### Phase 6 — Background jobs, Redis, events

### Phase 7 — Extended content (Notes, Uses, Resume)

---

## Pages

| Route        | Description                                            | Status      |
| ------------ | ------------------------------------------------------ | ----------- |
| `/`          | Home — featured post, current focus, selected projects | ✓           |
| `/blog`      | Blog list                                              | ✓           |
| `/now`       | What I'm currently focused on                          | coming soon |
| `/projects`  | Portfolio projects                                     | coming soon |
| `/about`     | About me                                               | coming soon |
| `/contact`   | Contact                                                | coming soon |
| `/resume`    | CV                                                     | coming soon |
| `/dashboard` | Admin — manage blog, projects, now-status              | ✓ (blog)    |

---

## Documentation

| File                    | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `MEDIATR.md`            | MediatR registration, pipeline, and usage explained |
| `HOW-TO-ADD-FEATURE.md` | Step-by-step guide to add a new CRUD feature        |
