# 🚀 Project Context: GanihuhStack

## 🎯 Visi Project

GanihuhStack bukan sekadar blog biasa, melainkan _full-stack learning project_ dan _developer hub_ pribadi. Project ini dirancang dengan arsitektur modern (Decoupled), memisahkan Backend API yang solid berbasis Clean Architecture dengan antarmuka Web SPA (Single Page Application) yang reaktif, hingga infrastruktur berstandar industri.

## 🛠️ Tech Stack & Infrastructure

- **Backend:** .NET (C#) Web API menggunakan template Clean Architecture dari Jason Taylor. Berperan murni sebagai penyedia layanan data (RESTful API).
- **Frontend:** Web SPA (Single Page Application) menggunakan kombinasi React & Svelte dengan TypeScript. Mendukung implementasi komponen dinamis dan _client-side routing_.
- **Database:** PostgreSQL.
- **DevOps & Deployment:**
  - Containerization: Docker
  - Orchestration: Kubernetes (K8s)
  - CI/CD pipelines: GitHub Actions

## 🏗️ System Architecture

Sistem dipetakan menggunakan konsep _layering_ yang ketat (berkaca pada pendekatan C4 Model):

- **Domain Layer:** _Entities, Enums, Exceptions, Interfaces, Types_.
- **Application Layer:** _Business logic, CQRS handlers (MediatR), Validators, DTOs_.
- **Infrastructure Layer:** PostgreSQL _data access_, _external APIs, file storage_.
- **Web/Presentation Layer:** Murni menyediakan Web API endpoints (REST/JSON) dan _controllers/minimal APIs_. **TIDAK** me-render UI (Non-MVC/Razor).

## 🏗️ System Architecture

Sistem dipetakan menggunakan konsep _layering_ yang ketat (berkaca pada pendekatan C4 Model untuk dokumentasi komponen):

- **Domain Layer:** _Entities, Enums, Exceptions, Interfaces, Types_.
- **Application Layer:** _Business logic, CQRS handlers (MediatR), Validators, DTOs_.
- **Infrastructure Layer:** PostgreSQL _data access_, _external APIs, file storage_.
- **Web/Presentation Layer:** Web API endpoints, _controllers/minimal APIs_.

## 🗺️ Sitemap & Frontend Pages

- `/` - Home
- `/about` - About
- `/projects` - Projects Portfolio
- `/blog` - Blog List & Posts
- `/notes` - Study Notes & Snippets
- `/uses` - Tech Gear & Tools List
- `/resume` - CV & Experiences
- `/contact` - Contact Form
- `/dashboard` - Admin/Private Dashboard
- `/now` - **[Special Feature]** "What I'm doing now" (Fokus saat ini, buku yang sedang dibaca, project yang sedang dikerjakan).

## 🗄️ Database Entities (Backend Data)

- `BlogPosts`
- `Projects`
- `Tags`
- `Categories`
- `Experiences`
- `Skills`
- `Certificates`
- `Messages` (dari Contact form)
- `Subscribers`

## 🚀 Future Roadmap & Expansion

Fitur-fitur data/modul yang akan dikembangkan secara iteratif:

1.  **ReadingList:** Tracking buku atau artikel yang sudah/sedang dibaca.
2.  **Bookmarks:** Kumpulan _link_ referensi keren dari internet.
3.  **LearningRoadmaps:** _Tracker_ progres belajar teknologi baru.
4.  **StudyNotes:** Catatan belajar komprehensif.

## 🤖 Instruksi Khusus untuk AI (Gemini)

Saat berinteraksi atau membantu _coding_ dalam project ini, AI **WAJIB** mematuhi aturan berikut:

1.  **Strict Clean Architecture:** Jangan pernah membocorkan _logic_ atau dependensi dari _Infrastructure_ ke _layer Domain_ atau _Application_.
2.  **TypeScript & Type Safety:** Pastikan kode _frontend_ (React/Svelte) selalu menggunakan _typing_ yang ketat, hindari penggunaan `any`.
3.  **DevOps Best Practices:** Berikan _config_ Docker, K8s, atau GitHub Actions yang aman, efisien, dan siap untuk _scale_.
4.  **Optimasi Database:** Saat membuat _migrations_ atau operasi _query_ ke PostgreSQL, pastikan _query_ optimal dan pertimbangkan _indexing_.
