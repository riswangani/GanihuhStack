# CLAUDE.md — GanihuhStack

This file gives Claude Code the context it needs to work on this repository correctly. Read it before making architectural decisions.

---

## 1. Project Overview

GanihuhStack is a long-term personal software engineering platform built and maintained by Gani. It is **not a tutorial project** — treat it as a real, production-grade application that evolves over time.

It serves multiple purposes simultaneously:

1. Personal portfolio website
2. Technical blog platform
3. Knowledge management system
4. Software engineering playground
5. Full-stack learning project
6. DevOps / cloud-native experimentation platform

The business domain stays intentionally simple (blog posts, projects, a "what I'm doing now" page). The complexity that's allowed to grow is **engineering practice** — architecture, testing, CI/CD, observability — not business logic.

---

## 2. Tech Stack

### Backend
- ASP.NET Core (C#)
- Clean Architecture — **Jason Taylor template**, used as-is (do not introduce a separate "Vertical Slice Architecture" pattern — see §3)
- MediatR (CQRS)
- FluentValidation
- Entity Framework Core
- PostgreSQL (via `Aspire.Npgsql.EntityFrameworkCore.PostgreSQL`)

### Frontend
- React 19
- TypeScript (strict mode)
- Vite
- React Router
- TanStack Query (server state)
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` plugin; design tokens live in the `@theme {}` block in `src/index.css`
- **shadcn/ui** — unstyled, accessible component primitives (Radix UI) for the dashboard/admin area; add components with `npx shadcn@latest add <component>`; components land in `src/components/ui/`
- `clsx` + `tailwind-merge` + `class-variance-authority` — used together via `cn()` in `src/lib/utils.ts`
- Lightweight global client state only when truly needed (e.g. Zustand) — avoid defaulting to heavy state management *(not yet installed)*

### Orchestration & Local Dev
- **.NET Aspire** — primary orchestration layer for local development and production targeting
  - `src/AppHost/` — Aspire AppHost project (orchestrates Web API + frontend + PostgreSQL)
  - `src/ServiceDefaults/` — shared Aspire service configuration (OpenTelemetry, health checks, resilience)
  - Aspire replaces Docker Compose for local development; Docker is still used for production image packaging

### Infrastructure & Deployment
- GitHub Actions (CI/CD)
- Azure Container Apps (via `Aspire.Hosting.Azure.AppContainers`) *(later phase)*
- Kubernetes (later phase, alternative to ACA)

### Future / later phases
- Redis
- Hangfire or a lightweight background job runner
- RabbitMQ
- OpenTelemetry, Prometheus, Grafana (Aspire's ServiceDefaults already wires up OpenTelemetry stubs)

---

## 3. Solution Structure

```
GanihuhStack/
├── src/
│   ├── AppHost/          # .NET Aspire orchestrator — entry point for local dev
│   ├── ServiceDefaults/  # Shared Aspire config (telemetry, health, resilience)
│   ├── Domain/           # Entities, Value Objects, Enums, Domain Events
│   ├── Application/      # CQRS handlers, validators, interfaces, DTOs
│   ├── Infrastructure/   # EF Core, Identity, external services
│   ├── Web/              # Minimal API endpoints (REST only, no UI)
│   │   └── ClientApp/    # React + Vite frontend (co-located, launched by AppHost)
│   └── Shared/           # Shared constants/service names used across AppHost + Infrastructure
├── tests/
│   ├── Domain.UnitTests/
│   ├── Application.UnitTests/
│   ├── Application.FunctionalTests/
│   ├── Infrastructure.IntegrationTests/
│   ├── Web.AcceptanceTests/      # Playwright + SpecFlow + Aspire integration
│   └── TestAppHost/              # Aspire AppHost for test environments
└── frontend/             # EMPTY — ignore. Actual frontend is at src/Web/ClientApp/
```

**Current state of Application layer**: still contains the Jason Taylor template placeholders (`TodoItems`, `TodoLists`, `WeatherForecasts`). These will be replaced by the actual domain features (`BlogPosts`, `Projects`, `NowStatus`) during Phase 1 — do not build on top of them.

---

## 4. Architecture

This project follows **Jason Taylor's Clean Architecture template** exactly. Do not layer an additional "Vertical Slice Architecture" concept on top of it — Jason Taylor's structure already groups CQRS handlers by entity/feature *inside* the Application layer, which gives feature-cohesion without breaking the layer boundary. That's the correct level of organization for this project; don't reinvent it.

### Domain Layer
- Entities, Value Objects, Enums, Domain Events, Exceptions
- No dependency on any other layer or external framework

### Application Layer
- CQRS Commands & Queries (MediatR), grouped by entity/feature folder, e.g.:

```
Application/
├── Common/
│   ├── Behaviours/
│   ├── Exceptions/
│   └── Interfaces/
├── BlogPosts/
│   ├── Commands/
│   │   ├── CreateBlogPost/
│   │   └── DeleteBlogPost/
│   └── Queries/
│       ├── GetBlogPosts/
│       └── GetBlogPostBySlug/
├── Projects/
│   ├── Commands/
│   └── Queries/
├── NowStatus/
│   ├── Commands/
│   └── Queries/
```

- Each Command/Query lives with its own Validator and Handler in the same folder.
- DTOs and interfaces (e.g. `IApplicationDbContext`) live here. The Application layer must not directly reference Infrastructure implementations — only abstractions.

### Infrastructure Layer
- EF Core + PostgreSQL via Aspire's `Aspire.Npgsql.EntityFrameworkCore.PostgreSQL` integration
- External services, file storage, email, caching implementations
- Implements interfaces defined in Application
- PostgreSQL connection string is injected by Aspire at runtime — do not hardcode connection strings

### Presentation / Web Layer (`src/Web/`)
- **Minimal API endpoints only** — uses `IEndpointGroup` pattern with `MapGroup()`, not MVC Controllers
- Authentication & Authorization
- Pure REST/JSON API — **does not render any UI** (no MVC views / Razor)
- Frontend (`ClientApp/`) lives here as a co-located npm project, launched separately by AppHost

### Shared Layer (`src/Shared/`)
- Shared constants (e.g. Aspire service names) used across `AppHost` and `Infrastructure`
- Must not contain business logic or domain types

### Dependency rule (non-negotiable)
`Domain ← Application ← Infrastructure`, and `Web` depends on `Application` + `Infrastructure` for composition only. `Shared` is a lateral utility, not a layer — it may be referenced by `AppHost` and `Infrastructure` only for plumbing constants. Infrastructure concerns must never leak into Domain or Application. If Claude is asked to add something that would violate this (e.g. referencing `DbContext` directly in a Domain entity), flag it instead of silently complying.

---

## 5. .NET Aspire

Aspire is the **primary orchestration mechanism** for this project. Understanding it is required before touching infrastructure or service wiring.

### How it works
- `src/AppHost/Program.cs` is the entry point for local development. It wires up:
  - `Web` (ASP.NET Core API)
  - `ClientApp` (React/Vite frontend via `AddNpmApp`)
  - PostgreSQL (currently commented out, will be re-enabled when DB work starts)
- `src/ServiceDefaults/Extensions.cs` configures OpenTelemetry, health checks, and HTTP resilience — added to every service via `AddServiceDefaults()`

### Rules when working with Aspire
- Service names (strings used in `AddProject`, `AddNpmApp`, `WithReference`) must come from constants in `src/Shared/` — never hardcode them inline
- PostgreSQL is provisioned by Aspire via `AddAzurePostgresFlexibleServer().RunAsContainer()` for local dev — do not add a manual Docker Compose for Postgres
- When adding a new backing service (Redis, RabbitMQ, etc.), add it through Aspire's hosting packages, not via raw Docker Compose
- `ServiceDefaults` must be added to every new service project

### Aspire vs Docker Compose
| Concern | Tool |
|---|---|
| Local dev orchestration | Aspire AppHost |
| Service discovery (local) | Aspire `WithReference()` |
| Production containers | Docker (image packaging) |
| Production hosting | Azure Container Apps or K8s |

---

## 6. Frontend

**Location**: `src/Web/ClientApp/` (NOT `frontend/` at root — that directory is empty and unused)

**How it runs**: AppHost launches it via `AddNpmApp(...).WithRunScript("dev")` — run the AppHost project to start everything together.

**Current state**: React 19 + Vite + React Router + TanStack Query + Tailwind CSS v4 + shadcn/ui scaffold. Auth and Blog endpoints are wired up.

### Styling rules
- **Use Tailwind classes** for all new UI code — no inline `style={{}}` except for truly dynamic values (e.g. `style={{ width: someVar + 'px' }}`).
- **Design tokens** are defined in `src/index.css` inside `@theme {}`. Add new tokens there; never hardcode hex values or magic numbers in component files.
- **`cn()` from `src/lib/utils.ts`** — always use it when combining conditional classes (`cn('base', condition && 'extra')`).
- **`cva`** (class-variance-authority) for components with variants (Button, Badge). Keeps variant logic out of JSX.
- **Public site components** (`src/components/brand/`, `src/components/core/`, `src/components/content/`) use the editorial newspaper design system — keep them faithful to the palette (ink/paper/accent).
- **shadcn/ui components** (`src/components/ui/`) are for the **dashboard/admin area only** — they don't belong on public-facing pages. Add them with `npx shadcn@latest add <component>`.
- **Path alias**: use `@/` for all internal imports (`@/components/...`, `@/services/...`, etc.).

### Principles
- Strongly typed throughout — **no `any`** unless absolutely unavoidable, and justified with a comment when used
- Feature-based folder structure, mirroring backend feature grouping where it makes sense
- TanStack Query for all server state — don't duplicate server data into client state
- Global client state (Zustand or similar) only for things that are genuinely cross-cutting (auth session, theme, UI shell state) — not as a default

### Target structure (to build toward)

```
src/Web/ClientApp/src/
├── features/
├── pages/
├── components/
├── services/
├── router/
├── store/
├── layouts/
└── shared/
```

---

## 7. Testing

Five test projects exist under `tests/`:

| Project | Type | Notes |
|---|---|---|
| `Domain.UnitTests` | Unit | Pure domain logic, no dependencies |
| `Application.UnitTests` | Unit | Handlers, behaviours, validators in isolation |
| `Application.FunctionalTests` | Functional | Full application stack, in-memory or real DB |
| `Infrastructure.IntegrationTests` | Integration | EF Core, DB-level tests |
| `Web.AcceptanceTests` | E2E | Playwright + SpecFlow + Aspire (`TestAppHost`) |

`TestAppHost` (`tests/TestAppHost/`) is a test-only Aspire AppHost used by acceptance tests to spin up the full stack.

### Testing rules
- Do not mock the database in integration or functional tests — use a real test database instance
- Acceptance tests run against the full Aspire stack via `TestAppHost`
- Unit tests should have zero infrastructure dependencies

---

## 8. Sitemap (Frontend Pages)

### MVP (Phase 1)
- `/` — Home
- `/about` — About
- `/projects` — Projects Portfolio
- `/blog` — Blog list & post detail
- `/contact` — Contact form
- `/now` — **"What I'm doing now"** (see §9 — this is an MVP feature, not deferred)
- `/dashboard` — Admin/private area (auth-gated: manage blog posts, projects, now-status)

### Later phases (not MVP — see §12 roadmap)
- `/notes` — Short-form study notes/snippets, distinct from formal blog posts
- `/uses` — Tools/gear list
- `/resume` — CV generated from `Experiences` / `Skills` / `Certificates` entities

---

## 9. The "Now" Feature

Purpose: when someone opens the site, they immediately see what Gani is currently focused on — active project, what he's currently learning/reading, current status. This is a **first-class MVP feature**, not an afterthought.

### Entity: `NowStatus`
Minimal MVP shape:

- `Id`
- `CurrentFocus` (string — short headline, e.g. "Building GanihuhStack's auth module")
- `Details` (text, optional longer description)
- `CurrentlyReading` (string, optional)
- `Mood` / `Status` (optional, small enum or free text — keep simple at MVP)
- `UpdatedAt`

Design notes:
- This is a **singleton-style entity in practice** (there's effectively one "current" row at a time), but model it as a normal table with a `CreatedAt`/`UpdatedAt` history rather than literally enforcing a single row — that gives you a free changelog of "what I was focused on over time" later (e.g. a `/now/history` page) without a schema change.
- Query side: a simple `GetCurrentNowStatus` query returning the latest entry is enough for MVP.
- Command side: `UpdateNowStatus` (admin-only, behind auth), which simply inserts a new row.
- Keep this entity in its own `NowStatus` feature folder in Application, same pattern as `BlogPosts` and `Projects` — don't bolt it onto an unrelated entity.

---

## 10. Blog Module

Blog posts contain:
- Title, Slug, Content, Excerpt
- PublishedDate, UpdatedDate
- Tags
- IsPublished

Future enhancements (not MVP): Categories, Search, Reading Time, SEO metadata.

---

## 11. Projects Module

Projects contain:
- Name, Description, Technologies, RepositoryUrl, DemoUrl, FeaturedFlag

---

## 12. Roadmap

### Phase 1 — MVP *(in progress)*
- ~~Project setup (Clean Architecture solution, React + Vite frontend)~~ ✓
- ~~.NET Aspire orchestration~~ ✓
- ~~Install frontend dependencies (React Router, TanStack Query, Tailwind CSS v4, shadcn/ui)~~ ✓
- ~~Authentication~~ ✓
- ~~Blog CRUD (backend) + public blog list page~~ ✓
- Clean up template placeholders (remove `TodoItems`, `TodoLists`, `WeatherForecasts`)
- Projects CRUD
- Now-status CRUD
- Remaining public portfolio pages (Sekarang, Proyek, Tentang, Kontak)
- Dashboard admin UI (blog + projects + now-status management)

### Phase 2 — Containerization & Production Config
- Dockerfile for Web API (Aspire already handles local dev — Docker needed for production images)
- Production `appsettings` and secrets management
- Structured logging

### Phase 3 — CI/CD
- GitHub Actions
- Automated testing pipeline (unit + integration + acceptance)
- Container image build & push

### Phase 4 — Cloud Deployment
- Azure Container Apps via Aspire's `Aspire.Hosting.Azure.AppContainers` *(already referenced in AppHost)*
- Or K8s manifests, Secrets, ConfigMaps, Ingress — decide at this phase

### Phase 5 — Observability
- Wire up full OpenTelemetry pipeline (Aspire's `ServiceDefaults` already adds the stubs)
- Prometheus, Grafana

### Phase 6 — Background work / events
- Redis, background jobs, event-driven features

### Phase 7 — Extended content modules
- `Notes` — study notes/snippets module
- `Uses` — tools/gear list
- `Resume` — `Experiences`, `Skills`, `Certificates` entities feeding a `/resume` page
- `ReadingList`, `Bookmarks`, `LearningRoadmaps` (stretch)

---

## 13. Coding Guidelines

Prefer:
- Small classes, small methods, clear naming
- SOLID principles, separation of concerns
- Production-ready code over clever/terse code

Avoid:
- God classes, fat controllers
- Business logic in controllers or endpoints
- Premature optimization
- Introducing new architectural patterns not already described in this file without flagging it first

---

## 14. AI Assistant Instructions

When generating code in this repository, Claude must:

1. Follow Clean Architecture exactly as described in §4 — never let Infrastructure leak into Domain or Application.
2. Use CQRS (MediatR) for every new feature; group by entity/feature folder under `Application/`, matching the target pattern (`BlogPosts/`, `Projects/`, `NowStatus/`).
3. Use FluentValidation for command/query validation, colocated with the handler.
4. Use PostgreSQL-compatible EF Core code — call out indexing or query-shape concerns when writing migrations or non-trivial queries. Connection strings come from Aspire — never hardcode them.
5. Use React + TypeScript (strict mode) on the frontend; avoid `any`; use TanStack Query for server state. Frontend lives at `src/Web/ClientApp/`. Style with Tailwind classes and the `cn()` helper — no inline `style={{}}` except for truly dynamic values.
6. Keep code production-ready, not tutorial-quality — but don't overengineer: start simple, design for extensibility, and avoid speculative abstractions.
7. Explain architectural tradeoffs before making a non-trivial structural decision (new layer, new cross-cutting concern, new package).
8. If a request would violate the dependency rule or introduce a pattern not in this document (e.g. true Vertical Slice Architecture, CQRS-less endpoints, MVC views in the Web layer, raw Docker Compose for local dev), say so explicitly rather than silently complying.
9. For new backing services (Redis, message queues, etc.), add them through Aspire hosting packages — not raw Docker Compose.
10. New service projects must call `AddServiceDefaults()` from `src/ServiceDefaults/`.
11. Service name constants belong in `src/Shared/` — never hardcode Aspire resource names inline.
12. For GitHub Actions and deployment configs, default to secure, efficient setups (no hardcoded secrets, least-privilege, proper resource limits).

---

## 15. Project Philosophy

GanihuhStack is not only a portfolio website. It is a long-term software engineering laboratory used to learn, practice, document, and showcase modern full-stack development, cloud-native architecture, and professional engineering workflows — built one real, working feature at a time.
