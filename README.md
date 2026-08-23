# Saksham Sathi ♿

**Saath Chalenge, Aage Badhenge — Empowering every ability with AI.**

Saksham Sathi is a career platform built for people with disabilities in India — helping them build skills, discover accessible job opportunities, and connect with inclusive employers. It also gives employers the tools to audit their own accessibility and reach a wider, underserved talent pool.

> "Saksham" (सक्षम) means "capable" and "Sathi" (साथी) means "companion" in Hindi — the platform is built around the idea that the right accommodations and matching remove the barrier, not the ability.

---

## ✨ Key Features

**For job seekers**
- 🧠 **AI Skills Assessment** — a short, adaptive assessment that surfaces strengths and suggests career paths
- 🎯 **Inclusive Job Matching** — jobs ranked by fit *and* by whether an employer offers the specific accommodations a candidate needs
- 📚 **Skill Building** — curated courses with progress tracking to close skill gaps for target roles
- 🎤 **AI Interview Coaching** — practice interviews with feedback before the real thing
- 📄 **Resume Builder & Resume Bank** — build an accessible resume, or get discovered by employers directly
- 🏛️ **Reserved Jobs (Govt. Quota)** — a dedicated feed of PwD-reserved government and PSU listings (SSC, banking, state secretariats, etc.) with category and document requirements
- ✉️ **Accommodation Letter Generator** — generate formal requests for workplace accommodations
- 👥 **Mentorship** — connect with mentors who share similar disabilities and have navigated the same career paths
- 🗣️ **Communication Assistant & Document Simplifier** — AI tools to simplify complex text and support workplace communication
- 📅 **Application Tracker, Calendar & Saved Items** — keep the whole job search organized in one place
- 🌐 **Offline Mode** — core features remain usable with unreliable connectivity
- 🌏 **Multi-language support** (English/Hindi, extensible)

**For employers**
- 🏢 **Employer Dashboard** — post jobs, manage applicants, and browse the candidate resume bank
- ♿ **Accessibility Audit** — assess and improve the accessibility of the employer's own hiring process and workplace
- 📊 **Employers Directory** — public-facing diversity & accessibility scores to help candidates find genuinely inclusive companies

**Accessibility-first, by design**
- Built-in accessibility wizard, live captions, text-to-speech, voice assistant, and a cognitive/simplified reading mode
- Adjustable motion, contrast, and focus-management baked into the app shell — not bolted on after

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS + shadcn/ui + `class-variance-authority` |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Accessibility | `@axe-core/react`, `focus-trap-react`, custom `AccessibilityContext` |
| i18n | Custom lightweight translation context |
| Testing | Vitest + React Testing Library |
| Linting | Oxlint |

> **Note:** This is currently a frontend prototype — job listings, mentors, match scores, and "AI" responses are powered by local mock data (`src/data/mockData.ts`) and browser `localStorage`, with no backend or live model calls yet. See [Roadmap](#-roadmap) below.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/RavendraPatel09/Saksham-Ai.git
cd Saksham-Ai

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other scripts

```bash
npm run build      # Type-check and build for production
npm run preview    # Preview the production build locally
npm run lint        # Run Oxlint
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

---

## 📁 Project Structure

```
apps/
├── web/                # React + Vite frontend
│   ├── public/          # Static browser assets
│   └── src/             # Pages, components, contexts, services, and styles
├── api/                # Express + Prisma backend
│   ├── prisma/          # Database schema and migrations
│   └── src/             # Controllers, routes, middleware, services, and RAG code
└── rag/                # RAG and voice-related applications
e2e/                    # Playwright end-to-end tests
scripts/                # Development and audit utilities
```

The repository uses a lightweight monorepo layout. Frontend commands run from the
root, while backend commands can be run with `npm run dev:api`, `npm run build:api`,
or directly from `apps/api`.

---

## 🗺️ Roadmap

- [ ] Connect a real backend (auth, persistence, job postings) instead of `localStorage`
- [ ] Wire AI features (assessment, job matching, document simplifier, interview coaching) to a real LLM API
- [ ] Replace mock job/employer data with a live or verified data source
- [ ] Add real employer-side job posting flow that feeds the candidate-facing job list
- [ ] SEO metadata, Open Graph tags, and proper page titles
- [ ] Deploy pipeline / CI

## 🖥️ Backend & RAG Layer Setup

A Node.js Express (TypeScript) backend is scaffolded under the `/backend` directory:
- **Database:** PostgreSQL with Prisma ORM.
- **Vector search:** `pgvector` extension for similarity query ranking.
- **Cache & Rate limiting:** Redis.
- **Security:** Helmet headers, CORS origin constraints, rate limiters, input sanitization, and JWT authentication (using short-lived tokens and rotating refresh tokens via `httpOnly` cookies).
- **Auto-Fallback Mode:** Fail-safe design that automatically falls back to in-memory storage (`FallbackStore`) if PostgreSQL or Redis are offline, maintaining demo stability.

### 1. Environment Configurations
Configure the configuration files in the root and backend folders:
```bash
# In the Frontend root:
cp .env.example .env

# In the backend/ folder:
cd backend
cp .env.example .env
```

### 2. Build & Launch Backend
Navigate to the `/backend` directory:
```bash
# Install backend dependencies
npm install

# Generate Prisma client artifacts
npm run db:generate

# Build database schema (if PostgreSQL is online)
npm run db:migrate

# Seed demo users, mock jobs, and courses
npm run db:seed

# Ingest taxonomy and policies into pgvector index
npm run rag:ingest

# Launch development API server
npm run dev

# Run Jest unit and integration tests
npm run test
```

### 3. Demo Credentials
The seeding scripts generate three pre-set accounts (passwords hashed with `argon2id`):
- **Standard User:** `demo.user@saksham.ai` / `sakshamUser2026` (Maps to `candidate` workspace mode)
- **Employer Account:** `demo.employer@saksham.ai` / `sakshamEmployer2026` (Maps to `employer` workspace mode)
- **Admin Account:** `demo.admin@saksham.ai` / `sakshamAdmin2026` (Maps to cross-fetch operations)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/RavendraPatel09/Saksham-Ai/issues).

## 📄 License

*Add your chosen license here (e.g. MIT).*

## 👤 Author

**Ravendra Patel**
GitHub: [@RavendraPatel09](https://github.com/RavendraPatel09)
