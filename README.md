# Dev Hire Platform

A NestJS backend for a developer hiring platform — companies post jobs, candidates apply, and application workflows are managed in one place.

This project was built **to learn new architectures and patterns**. It practices Clean Architecture, Hexagonal Architecture, use-case–driven design, the Repository pattern, Unit of Work, and domain-driven error handling.

---

## What this project does

### Authentication & users

- **Registration** as a **company** (with company name and optional logo URL) or as a **candidate** (with first name and last name). Email and password with strong validation.
- **Login** (JWT access + refresh tokens), **logout**, and **token refresh**. Authenticated **me** endpoint to get current user with company or candidate profile.

### Companies

- **Company profile**: create on register; update **name** and **logo** later.
- **Logos** are stored in S3. Clients get a **presigned upload URL** (via `POST /files/upload-url` with type `COMPANY_LOGO`), upload the file to S3, then send the resulting key/URL when updating the company profile. Allowed: JPEG, PNG, WebP; max 2 MB.
- **Subscription plans**: FREE, PRO, ENTERPRISE. FREE can have at most **3 active jobs**; PRO up to 10; ENTERPRISE up to 100. Plan upgrade endpoint (e.g. upgrade to PRO) is available for payment integration.
- **Webhooks**: companies can **register webhook URLs**. On each new job application, the platform sends an HTTP POST to those URLs (event `new_application` with jobId, candidateProfileId, candidateCVId). Delivery attempts and status are tracked; retries on 5xx with exponential backoff.

### Jobs

- **Create jobs** (title, description, requirements, location, work type, status, expiry, and **custom questions**). Work types: REMOTE, HYBRID, ONSITE. Status: DRAFT, ACTIVE, INACTIVE. Creating is guarded by subscription limit (e.g. FREE = max 3 jobs).
- **Custom job questions** when creating a job: TEXT, TEXTAREA, NUMBER, BOOLEAN; required/optional and sort order. Questions can also be **bulk added**, **bulk updated**, or **bulk deleted** per job.
- **List jobs** with optional **full-text search** (PostgreSQL): search over job title, description, requirements text, location, and company name. Optional filter by **work type**.
- **Get job details** by ID; **update** and **delete** (soft delete). Companies can list **owned jobs** and manage them.
- **Expired jobs** are automatically closed by a **daily cron** (runs at midnight).

### Candidates

- **Candidate profile**: create on register; update first name and last name.
- **CVs**: candidates can **create**, **update**, and **delete** multiple CVs. CVs are stored in S3 via **presigned upload URL** (type `CV`; PDF only, max 5 MB). Download also via presigned URL.
- **Apply to a job**: candidate picks a CV and answers the job’s custom questions. Validation ensures required answers and types. One application per candidate per job. On success: **confirmation email** is queued (BullMQ) and **company webhooks** are dispatched (also via queue).
- **Withdraw** an application.
- **List applications** (owned by candidate); **get application details** (with questions and answers) for the owning company or candidate.

### Companies: applications

- **List applications per job** (for the job owner).
- **Update application status**: PENDING → REVIEWED → INTERVIEWED → OFFER_MADE → HIRED or REJECTED.
- **Subscription limits** also cap max applications per job (e.g. FREE = 10 per job, PRO = 100, ENTERPRISE = 1000).

### Files

- **Presigned URLs** for upload and download. Two types: **COMPANY_LOGO** (images, public read) and **CV** (PDF, private). Rules (MIME types, max size, S3 folder) are centralized in the file-uploader module.

### Infrastructure & cross-cutting

- **Rate limiting** (Throttler), **global exception filter** mapping domain errors to HTTP status and a unified `{ success: false, message }` body.
- **Guards**: require JWT; require company profile, candidate profile, or either; and job-creation limit per subscription.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Module Structure](#module-structure)
- [Patterns Used](#patterns-used)
- [Project Setup](#project-setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Resources](#resources)

---

## Tech Stack

| Area                  | Technology                             |
| --------------------- | -------------------------------------- |
| **Framework**         | NestJS 11, TypeScript                  |
| **Database**          | PostgreSQL, Prisma ORM (multi-schema)  |
| **Cache / Session**   | Redis (Keyv)                           |
| **Queue**             | BullMQ (Redis-backed)                  |
| **File Storage**      | AWS S3 (presigned URL upload/download) |
| **Authentication**    | Passport (JWT + Local), bcrypt         |
| **API Documentation** | Swagger (OpenAPI)                      |
| **Validation**        | class-validator, class-transformer     |
| **Rate limiting**     | @nestjs/throttler                      |
| **Scheduled Jobs**    | @nestjs/schedule (cron)                |

---

## Architecture

The project is organized around **Clean Architecture / Hexagonal Architecture**. Business logic is kept independent of the framework and infrastructure; dependencies point inward toward the domain and application layers (dependency rule).

### Layers

Each **feature module** (e.g. `job`, `company`, `candidate`) is split into three main folders:

```
modules/<module-name>/
├── domain/           # Core business rules (framework-agnostic)
├── application/      # Use cases and ports (abstractions)
└── infra/            # HTTP, DB, external services (adapters)
```

#### 1. Domain

- **Responsibility:** Entities, value objects, domain errors, enums, and (optionally) domain services.
- **Dependencies:** Only its own domain or shared types; no NestJS or Prisma.
- **Examples:** `Job`, `JobApplication`, `CompanyProfile`, `CandidateProfile`, `JobNotActiveError`, `WorkType`, `JobStatus`.

#### 2. Application

- **Responsibility:** Use cases (single workflow per class), abstract repository/port interfaces, command/query DTOs.
- **Dependencies:** Domain + abstract repositories; no infrastructure details (Prisma, HTTP).
- **Examples:** `CreateJobUseCase`, `GetApplicationDetailsByIdUseCase`, `JobRepository` (abstract), `CreateJobCommand`.

#### 3. Infra (Infrastructure)

- **Responsibility:** HTTP controllers, Prisma repository implementations, request/response DTOs, mappers, Nest module definitions.
- **Dependencies:** Uses application and domain; Prisma, Express, S3, etc. live here.

### Data Flow

```
HTTP Request
    → Controller (infra)
    → Use Case (application)
    → Repository (interface in application, implementation in infra)
    → Domain entity / Domain error
    → Response DTO + Mapper (infra)
    → HTTP Response
```

- The controller only handles HTTP and passes commands/queries to use cases.
- Use cases depend on repositories and optionally domain services; they do not care how data is stored.
- Repository implementations (e.g. `PrismaJobRepository`) talk to Prisma and map to domain entities.

### Shared Structures (`shared/`)

- **Filters:** `HttpExceptionFilter` — maps domain errors to HTTP status and message.
- **Guards:** `RequireCompanyProfileGuard`, `RequireCandidateProfileGuard`, `RequireCompanyOrCandidateProfileGuard` — enforce role/profile requirements.
- **Decorators:** Swagger and response wrappers.
- **Errors:** `DomainError`, `DomainErrorCode` — central domain error code → HTTP status mapping.
- **Modules:** Prisma, Queue (BullMQ), Mail, Unit of Work — used by multiple feature modules.

---

## Module Structure

| Module             | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **auth**           | Registration, login, JWT access/refresh, logout, token validation.                                        |
| **user**           | User CRUD, roles (company/candidate), profile relations.                                                  |
| **company**        | Company profile, subscription plan, profile updates.                                                      |
| **candidate**      | Candidate profile, CV management (create, update, delete).                                                |
| **job**            | Job CRUD, job questions, apply, withdraw, application details, status updates, close expired jobs (cron). |
| **subscription**   | Subscription limits, plan upgrade (abstraction for payment integration).                                  |
| **file-uploader**  | S3 presigned URL upload/download, file type and size rules.                                               |
| **webhook**        | Company webhooks, HTTP callbacks on new application events, delivery tracking.                            |
| **Queue (shared)** | Email and webhook dispatch queues (BullMQ), workers.                                                      |
| **Mail (shared)**  | Email sending abstraction (mock/production).                                                              |

Modules depend on each other via **interfaces** (repositories, queue, mail); infrastructure classes are not injected directly.

---

## Patterns Used

### 1. Use Case (Application Service)

Each workflow is implemented in a single use case class. The controller injects the use case and calls `execute(command)`. Examples: `GetApplicationDetailsByIdUseCase`, `ApplyJobUseCase`, `CreateJobUseCase`.

### 2. Repository (Port & Adapter)

- **Application:** `abstract class JobRepository` — method signatures and domain types.
- **Infra:** `PrismaJobRepository` — Prisma implementation and mapping to domain entities.

Use cases stay unchanged if the database or ORM is swapped.

### 3. Unit of Work

`UnitOfWorkRepository` is used to run multiple repository operations in a single transaction. `PrismaUnitOfWorkRepository` provides the transaction context via `prisma.$transaction(work)`.

### 4. Domain Errors

Errors are defined in the domain with `DomainError` and `DomainErrorCode`. `HttpExceptionFilter` catches them and returns the appropriate HTTP status and `{ success: false, message }` body.

### 5. Command / Query DTOs

Input to use cases is carried by command or query objects (e.g. `CreateJobCommand`, `GetJobsCommand`). The controller maps from HTTP DTOs to these commands.

### 6. Mappers

In infra, mappers convert between Prisma/DB models ↔ domain entities and domain/application data ↔ HTTP response DTOs (e.g. `JobResponseMapper`, `JobApplicationDetailsMapper`).

### 7. Scheduled Jobs

Cron jobs are defined with `@nestjs/schedule` (e.g. `CloseExpiredJobsCron` to close expired job postings).

### 8. Async Processing with Queues

When an application is created, email and webhook notifications are enqueued; BullMQ workers process them. The HTTP response returns without waiting for those side effects.

---

## Project Setup

### Requirements

- Node.js (LTS recommended)
- pnpm
- PostgreSQL
- Redis (for BullMQ and cache)
- AWS S3 (for file uploads; localstack or mocks can be used in development)

### Steps

```bash
# Install dependencies
pnpm install

# Environment variables
# Create a .env file with DATABASE_URL, REDIS_URL, JWT secrets, S3 credentials, etc.

# Generate Prisma client and run migrations
pnpm prisma:generate
pnpm prisma:migrate
```

---

## Running the App

```bash
# Development (watch mode)
pnpm run start:dev

# Debug
pnpm run start:debug

# Production build and run
pnpm run build
pnpm run start:prod
```

Swagger UI is typically available at `http://localhost:3000/api` (or your app base URL + `/api`).

---

## Testing

```bash
# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

---

## Database and Prisma

- Prisma schema lives under `prisma/`, split by domain (e.g. `schemas/jobs.prisma`, `schemas/user.prisma`); main entry is `schema.prisma` (generator + datasource).
- Client output: `src/generated/prisma` (per project configuration).
- Migrations: `pnpm prisma:migrate`
- Prisma Studio: `pnpm prisma:studio`

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
