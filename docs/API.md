# API overview
All `/api` routes except `GET /api/health`, `GET /api/plans`, auth endpoints and Stripe webhook require `Authorization: Bearer <accessToken>` where noted.

| Method | Path | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public, rate limited |
| POST | /api/auth/refresh | Public refresh token |
| POST | /api/auth/logout | Public refresh token |
| GET | /api/auth/me | Authenticated |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password | Public reset token |
| GET | /api/plans | Public |
| GET/POST | /api/projects | Auth; create Owner/Admin/Manager |
| PATCH/DELETE | /api/projects/:id | Owner/Admin/Manager |
| GET/POST | /api/tasks | Auth; create Owner/Admin/Manager |
| PATCH/DELETE | /api/tasks/:id | Assigned Member status update; otherwise Owner/Admin/Manager |
| GET/POST | /api/customers | Auth; create Owner/Admin/Manager |
| PATCH/DELETE | /api/customers/:id | Owner/Admin/Manager |
| GET | /api/members | Owner/Admin |
| POST | /api/members/invite | Owner/Admin |
| POST | /api/members/accept | Public invitation token |
| PATCH/DELETE | /api/members/:id | Owner |
| GET | /api/usage | Owner/Admin |
| GET | /api/audit | Owner/Admin |
| GET | /api/billing/current | Auth |
| POST | /api/billing/checkout | Owner |
| POST | /api/billing/webhook | Stripe signature |

Errors use `{ success:false, code, message }`. List endpoints include pagination metadata where applicable.
