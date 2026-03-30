# AI Tutor Academy

Personalised AI-powered tutoring platform for UK Maths and English, aligned with the National Curriculum (KS2 & KS3).

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4, Radix UI primitives, Framer Motion
- **Database:** PostgreSQL via Prisma ORM (Supabase-hosted)
- **Auth:** NextAuth.js v4 (Credentials provider, JWT sessions)
- **Validation:** Zod
- **Testing:** Vitest (unit) + Playwright (e2e)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (or a [Supabase](https://supabase.com) project)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Then edit .env with your database URL, NextAuth secret, etc.

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate deploy

# 5. Seed the database (optional — adds demo data)
npm run db:seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Accounts (after seeding)

| Role   | Email               | Password     |
| ------ | ------------------- | ------------ |
| Admin  | admin@test.com      | Password123  |
| Parent | parent@test.com     | Password123  |

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server                 |
| `npm run build`      | Create production build                  |
| `npm run start`      | Start production server                  |
| `npm run lint`       | Run ESLint                               |
| `npm run typecheck`  | Run TypeScript type checking             |
| `npm test`           | Run unit tests (Vitest)                  |
| `npm run test:watch` | Run unit tests in watch mode             |
| `npm run test:coverage` | Run tests with coverage report        |
| `npm run test:e2e`   | Run end-to-end tests (Playwright)        |
| `npm run db:migrate` | Apply database migrations                |
| `npm run db:seed`    | Seed database with demo data             |
| `npm run db:studio`  | Open Prisma Studio (DB browser)          |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login & signup pages
│   ├── admin/              # Admin dashboard (role-protected)
│   ├── parent/             # Parent dashboard (role-protected)
│   ├── student/            # Student dashboard (role-protected)
│   ├── lesson/[id]/        # Individual lesson view
│   ├── privacy/            # Privacy policy
│   ├── api/                # API routes (auth, health)
│   └── actions/            # Server Actions (auth, student, parent, admin)
├── components/             # Shared UI components
│   └── ui/                 # Radix/shadcn-style primitives
├── lib/                    # Utilities, DB client, validation schemas
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── validations/        # Zod schemas
│   ├── queries/            # Database query functions
│   ├── logger.ts           # Structured logging
│   ├── rate-limit.ts       # In-memory rate limiter
│   └── student-context.tsx # Student selection context
├── types/                  # TypeScript type extensions
└── __tests__/              # Unit tests

prisma/
├── schema.prisma           # Database schema
├── migrations/             # Versioned SQL migrations
└── seed.ts                 # Database seeder

e2e/                        # Playwright end-to-end tests
```

## Architecture

### Authentication & Authorization

- **NextAuth.js** with Credentials provider (bcrypt password verification)
- **JWT sessions** with `role` and `id` claims
- **Middleware** (`src/middleware.ts`) enforces route protection and role-based access
- Roles: `PARENT`, `ADMIN` (Students are child profiles under parents)

### Security

- Rate limiting on login and signup endpoints
- Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Zod validation on all server actions
- CUID format validation on all entity IDs
- Password policy: 8+ chars, uppercase, lowercase, number

### Database

- PostgreSQL with Prisma ORM
- Models: User, Student, Subject, Module, Lesson, LessonProgress, Achievement, GameScore
- Cascading deletes on parent-child relationships
- Unique constraints on email, slug, and composite keys

## Docker

```bash
# Build and run with Docker Compose
docker compose up --build

# Or build the image directly
docker build -t tutor-academy .
docker run -p 3000:3000 --env-file .env tutor-academy
```

## Deployment

### Vercel (Recommended)

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel's dashboard
4. Deploy

### Self-Hosted

1. Build: `npm run build`
2. Migrate: `npx prisma migrate deploy`
3. Start: `npm start`

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Lint & Type Check** — ESLint + TypeScript
2. **Unit Tests** — Vitest with coverage
3. **Build** — Verifies the production build succeeds
4. **E2E Tests** — Playwright (on main branch pushes only)

## License

Private — All rights reserved.
