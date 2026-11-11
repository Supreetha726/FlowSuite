# FlowSuite — Multi-tenant SaaS Workspace

JavaScript implementation of the supplied FlowSuite PRD. Stack: React/Vite, Express, PostgreSQL, Prisma 7, Redis, JWT, Stripe test mode, Docker Compose.

## Requirements
- Docker Desktop running in Linux-container mode
- Node.js 20+ and npm (only needed for local development outside Docker)
- Stripe test keys for checkout (optional until billing is configured)

## Run the complete stack
1. Copy `backend/.env.example` to `backend/.env` and change both JWT secrets.
2. From this folder run `docker compose up --build -d`.
3. Open http://localhost:5173 and API health at http://localhost:5000/api/health.
4. The API container runs Prisma migrations and seeds the Free/Starter/Professional plans on startup.

## Local development
Start PostgreSQL and Redis with `docker compose up -d postgres redis`. In `backend`, run `npm install`, `npx prisma generate`, `npx prisma migrate dev --name init`, `npm run seed`, `npm run dev`. In `frontend`, run `npm install` and `npm run dev`.

## Environment
See `backend/.env.example`. Never commit `.env` or real Stripe secrets. Use Stripe test-mode keys only.

## Main API routes
- `/api/auth`: register, login, refresh, logout, forgot/reset password, me
- `/api/members`: list, invite, accept invitation, update role, remove
- `/api/projects`: CRUD/archive
- `/api/tasks`: CRUD/status
- `/api/customers`: CRUD/archive
- `/api/plans`, `/api/billing`: plans, checkout, Stripe webhook
- `/api/usage`, `/api/audit`: usage dashboard and audit log

All tenant-owned records are scoped by the organization ID resolved from the JWT user's membership. Role enforcement is server-side. See `docs/ARCHITECTURE.md` and `docs/API.md`.

## Important implementation notes
- The PRD lists TypeScript for Option A. This deliverable follows your explicit JavaScript preference; it is a JavaScript adaptation of Option A. `prisma.config.ts` is the only TypeScript configuration file because Prisma 7 loads its datasource URL from the Prisma config file. Application code is JavaScript/JSX.
- Email delivery is out of scope in the PRD: password-reset and invite tokens are returned only in development responses. In production, connect a mail provider before enabling those flows publicly.
- Stripe checkout/webhook requires test-mode credentials and a publicly reachable webhook URL. Without credentials, billing endpoints return a clear configuration error.
- Review and test before deploying. This is a complete internship-project foundation, not a security audit or a claim of production certification.

## Demo billing mode

This project is configured for local demonstration billing. On the Plans & billing page, an OWNER can select **Activate demo plan** to switch the workspace subscription to Starter or Professional without Stripe or a real payment. The selected plan is saved in PostgreSQL and the normal plan entitlements/limits continue to apply. This is a simulation only and must not be used as a production payment flow.

After replacing the project files, rebuild the API and web containers from the project root:

```bash
docker compose up --build -d api web
```
