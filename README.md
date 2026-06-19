# Personal — Backend Architecture Sample

> A curated, sanitized excerpt from a private production codebase, shared to demonstrate backend architecture, testing practices, and code quality.

This repository is **not** a full application — it's a deliberately scoped sample extracted from a private Node.js/TypeScript backend I built for an AI-powered fitness coaching product. It exists to give hiring teams a concrete, runnable look at how I structure backend code, without exposing the proprietary business logic of the underlying product.

**Full repository access available on request** — happy to do a screen-share walkthrough or grant temporary read access during the hiring process.

---

## What it does

A small but complete user flow, end to end:

1. **Register / Login** — standard auth with bcrypt + JWT.
2. **Onboarding** — the user picks a goal (`muscle_gain` or `fat_loss`). The system generates a fixed 3-exercise plan; only target reps and rest periods change based on the goal.
3. **Start a session** — begins a workout session tied to the user's plan.
4. **Log sets** — for each exercise, the user logs weight × reps. The backend estimates their one-rep max (1RM) using the Epley formula.
5. **Finish the session** — returns a summary with the best 1RM achieved per exercise and the suggested working weight for next time.

> **Note on scope**: this flow uses a single hardcoded 3-exercise plan and a simplified onboarding step, intentionally. The production system generates a full AI-driven 16-week periodized plan from a richer onboarding flow. This simplification exists purely to demonstrate the same architectural pattern — domain logic, use-case orchestration, persistence — without exposing the real plan-generation logic. It also keeps the demo testable in under a minute, instead of requiring a 16-week training cycle to see results.

---

## Try it locally

```
npm install
npm run dev
```

Then, with the server running on `http://localhost:3000`:

```
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword123","name":"Your Name"}'

# 2. Login — copy the token from the response
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword123"}'

# 3. Onboarding — pick a goal (replace TOKEN)
curl -X POST http://localhost:3000/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"goal":"muscle_gain"}'

# 4. Start a session (replace TOKEN)
curl -X POST http://localhost:3000/workout/start \
  -H "Authorization: Bearer TOKEN"

# 5. Log a set — copy sessionId from step 4 (replace TOKEN and SESSION_ID)
curl -X POST http://localhost:3000/workout/SESSION_ID/log-set \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"exerciseId":"ex-1","weight":80,"reps":8}'

# 6. Finish — get the next-session weight suggestion (replace SESSION_ID and TOKEN)
curl -X POST http://localhost:3000/workout/SESSION_ID/finish \
  -H "Authorization: Bearer TOKEN"
```

Or skip curl entirely and use the interactive Swagger UI at `http://localhost:3000/api-docs`.

> **Data is not persisted.** Users, plans, and sessions live in a `Map` in the server's memory — there's no database. Stopping the server (or restarting it) clears everything, so you'll need to register again. This is intentional, not a bug — see "Why an in-memory database" below.

---

## Why this repo is scoped this way

The original codebase implements a complete product (AI-driven plan generation, adaptive training-volume logic, exercise recommendation engine, pain-reporting system). Publishing it in full would mean publishing the product itself.

What's included here is the part that's genuinely reusable as a **demonstration of engineering practice**, independent of the product it came from:

- Clean Architecture layering (domain → application → infrastructure)
- Domain entities with real business rules and immutable state transitions (`Session.logSet()`, `Session.complete()`)
- A domain service with non-trivial math (`CalibrationService`, the Epley formula)
- Use-case orchestration spanning a full multi-step user flow (register → onboard → start session → log sets → finish)
- DTO validation, error handling, and dependency injection, consistent across every endpoint
- **A real, running HTTP server**, wired through the same controller/route/container pattern as the production project

What's **deliberately excluded**: AI prompt engineering, the training-load/volume-adjustment algorithms, the exercise-recommendation logic, and the full periodized plan structure — these are the core product differentiators.

---

## Why an in-memory database

The deployed demo uses in-memory repositories instead of a real PostgreSQL database. This is deliberate, not a limitation:

- It proves the Clean Architecture claim: every use case depends only on a repository **interface** (`IUserRepository`, `ISessionRepository`, `IWorkoutPlanRepository`). The production version of this project swaps in Prisma-backed implementations of the same interfaces — **zero changes to any use case are needed to make that swap.**
- It avoids exposing any real database schema, connection details, or infrastructure from the production system.
- It keeps this demo free to host and instantly deployable, with no external dependencies.

The Prisma/PostgreSQL implementations are part of what's available on request from the full private repository.

---

## Stack (full project)

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| HTTP Framework | Express 5 |
| Language | TypeScript (`tsx`, no build step) |
| Database | PostgreSQL 16 (full project) / in-memory (this demo) |
| ORM | Prisma 7 + `@prisma/adapter-pg` (full project) |
| Validation | Zod 4 |
| Authentication | JWT + bcrypt |
| AI | OpenAI API (full project only) |
| Testing | Vitest 4 |

This sample requires nothing beyond Node.js to run locally — no database, no Docker, no setup beyond an optional `JWT_SECRET`.

---

## Architecture

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Session.ts            # workout session — immutable state transitions
│   │   └── WorkoutPlan.ts        # fixed 3-exercise plan, varies by goal
│   ├── value-objects/
│   │   ├── Email.ts
│   │   └── WorkoutGoal.ts
│   ├── services/
│   │   └── CalibrationService.ts     # Epley formula — 1RM estimation
│   ├── repositories/              # interfaces only
│   │   ├── IUserRepository.ts
│   │   ├── ISessionRepository.ts
│   │   └── IWorkoutPlanRepository.ts
│   └── errors/
│       └── DomainError.ts
│
├── application/
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   └── LoginUserUseCase.ts
│   │   ├── onboarding/
│   │   │   └── OnboardingUseCase.ts
│   │   └── workout/
│   │       ├── StartSessionUseCase.ts
│   │       ├── LogSetUseCase.ts
│   │       └── FinishSessionUseCase.ts
│   ├── dto/                       # Zod validation schemas
│   └── errors/
│       └── UseCaseError.ts
│
├── infrastructure/
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   ├── repositories/               # concrete implementations
│   │   ├── InMemoryUserRepository.ts
│   │   ├── InMemorySessionRepository.ts
│   │   └── InMemoryWorkoutPlanRepository.ts
│   └── ioc/
│       └── container.ts           # dependency injection — single wiring point
│
└── main.ts

tests/                              # mirrors src/, AAA pattern, mocked repositories
docs/DEPLOY.md                      # how to deploy this to Render
```

**Dependency rule**: domain never imports application or infrastructure. Application never imports infrastructure. Enforced by convention and reviewed in every PR on the full project.

```
Infrastructure (Express, Prisma, OpenAI)
        ↑ depends on
Application (use cases, DTOs)
        ↑ depends on
Domain (entities, value objects, pure rules)

Domain ─/─► never depends on Application or Infrastructure
```

---

## Running locally

```
npm install
npm run dev
```

Server starts on `http://localhost:3000`.

---

## Running the tests

```
npm install
npm test
```

No environment variables or database required — everything runs against mocks.

---

## A note on the full product

The full backend (not in this repo) implements, among other things:
- AI-driven workout plan generation with user-defined duration and goals
- An adaptive training-volume engine that adjusts load/intensity based on session completion rate and perceived effort (RPE)
- ATL/CTL/TSB training-load metrics
- An exercise-recommendation system that selects alternatives based on experience level and user-reported discomfort, using a Bayesian Average to score each exercise's comfort rating

I'm glad to walk through any of this live, or share read access to the full private repository — just ask.