# Personal — Backend Architecture Sample

> A small, focused excerpt from a private production codebase, shared to demonstrate backend architecture and code quality.

This is **not** a full application — it's a deliberately scoped sample extracted from a private Node.js/TypeScript backend for an AI-powered fitness coaching product. It exists to give hiring teams a concrete, runnable look at how I structure backend code, without exposing the underlying product.

**Full repository access available on request** — happy to walk through it live or grant temporary read access during the hiring process.

---

## What it does

A simple, complete flow: register → login → onboarding.

1. **Register / Login** — standard auth with bcrypt + JWT.
2. **Onboarding** — pick a training goal (`muscle_gain` or `fat_loss`) and instantly receive a complete **Push/Pull/Legs (PPL)** workout plan.

The exercise list is fixed. What changes based on the goal is **reps, sets, and rest time**, following evidence-based training guidelines:

| Goal | Reps | Sets | Rest |
|---|---|---|---|
| Muscle gain (hypertrophy) | 10 | 4 | 75s |
| Fat loss | 14 | 3 | 40s |

That's the whole scope. No database setup, no external services — just a clean, tested slice of a larger system.

---

## Try it locally

```bash
npm install
npm run dev
```

With the server running on `http://localhost:3000`:

```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword123","name":"Your Name"}'

# 2. Login — copy the token from the response
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword123"}'

# 3. Onboarding — pick a goal, get your plan
curl -X POST http://localhost:3000/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"goal":"muscle_gain"}'
```

Or use the interactive Swagger UI at `http://localhost:3000/api-docs`.

> **Data is not persisted.** Users live in memory — there's no database. Restarting the server clears everything. This is intentional, not a bug (see below).

---

## Why this repo is scoped this way

The full backend implements a much larger product (AI-driven plan generation, adaptive training logic, exercise recommendations, pain reporting). Publishing it in full would mean publishing the product itself.

What's here demonstrates the engineering practice behind it, independent of the product:

- Clean Architecture layering (domain → application → infrastructure)
- A domain value object encoding evidence-based training guidelines (`Goal`)
- A domain entity that generates a structured plan from those guidelines (`WorkoutPlan`)
- Use-case orchestration across a real, multi-step flow (register → login → onboarding)
- DTO validation, error handling, and dependency injection, consistent across every endpoint
- A real, running HTTP server with interactive Swagger documentation

---

## Why an in-memory database

The demo uses an in-memory repository instead of PostgreSQL. This is deliberate:

- It proves the architecture works as designed — the use case depends only on `IUserRepository`, an interface. The production version swaps in a Prisma-backed implementation of that same interface with **zero changes to the use case.**
- It avoids exposing any production database schema or infrastructure.
- It keeps this demo dependency-free and instantly runnable.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| HTTP Framework | Express 5 |
| Language | TypeScript (`tsx`, no build step) |
| Validation | Zod 4 |
| Authentication | JWT + bcrypt |
| API Documentation | Swagger (OpenAPI 3) |
| Testing | Vitest 4 |
| Database | In-memory (this demo) / PostgreSQL + Prisma 7 (full project) |

---

## Project structure

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── WorkoutPlan.ts          # generates a PPL plan from a Goal
│   ├── value-objects/
│   │   ├── Email.ts
│   │   └── Goal.ts                 # muscle_gain / fat_loss + training guidelines
│   └── errors/
│       └── DomainError.ts
│
├── application/
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   └── LoginUserUseCase.ts
│   │   └── onboarding/
│   │       └── GenerateWorkoutPlanUseCase.ts
│   ├── dto/                        # Zod validation schemas
│   └── errors/
│       └── UseCaseError.ts
│
├── infrastructure/
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   ├── repositories/
│   │   └── InMemoryUserRepository.ts
│   ├── config/
│   │   └── swagger.ts
│   └── ioc/
│       └── container.ts            # dependency injection — single wiring point
│
└── main.ts

tests/                              # mirrors src/, AAA pattern, mocked repositories
```

**Dependency rule**: domain never imports application or infrastructure. Application never imports infrastructure.

```
Infrastructure (Express, dependencies)
        ↑ depends on
Application (use cases, DTOs)
        ↑ depends on
Domain (entities, value objects, pure rules)
```

---

## Running the tests

```bash
npm test
```

All tests use mocked repositories — no database required.

---

## A note on the full product

The full backend (not in this repo) also includes:
- AI-driven, fully personalized workout plan generation
- Adaptive training-volume control based on performance and effort
- An exercise recommendation engine
- Pain/discomfort reporting with AI-guided responses
- A context-aware AI training chat

Available on request — happy to walk through it live during the hiring process.

---

## License

Provided as a portfolio sample. Contact for licensing details if needed.