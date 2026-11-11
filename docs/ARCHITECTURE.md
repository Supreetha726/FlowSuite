# Architecture and tenant isolation

React SPA → Express REST API → Prisma → PostgreSQL. Redis is connected for usage/rate-limit support. JWT access tokens identify the user; middleware loads that user's single Membership and Organization. Tenant-owned list and detail queries always include `organizationId: req.organization.id`. Detail mutations first fetch by both resource ID and organization ID. Membership is unique by `userId`, enforcing the PRD's one-organization-per-user rule. Tasks carry organizationId in addition to projectId so task queries are tenant-scoped directly.

Authorization is server-side: Owner controls billing and membership; Admin manages workspace records and views usage/audit; Manager manages projects/tasks/customers; Member sees assigned work and can update only assigned task status. Plan limits are read from Plan rows; feature gates use PlanEntitlement + Entitlement codes, not plan-name comparisons. AuditLog is append-only through the API. Passwords use bcrypt; refresh and reset tokens are stored as SHA-256 hashes. Stripe uses test-mode Checkout and signed webhooks only.

## Known integration steps
Configure Stripe test price IDs in Plan.stripePriceId before checkout. Configure a mail provider before production use of invitations/password resets; development mode returns the token for local testing. Configure HTTPS, strong secrets, backups, and rate limiting at the reverse proxy before deployment.
