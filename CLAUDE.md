# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot reload via ts-node-dev)
npm run dev

# Build TypeScript to dist/
npm run build

# Run compiled output
npm start
```

There is no test runner configured in this project.

## Architecture

Express + TypeScript + Mongoose backend for a portfolio website. All source is under `src/`, compiled output goes to `dist/`.

### Module structure

Each feature domain lives in `src/modules/<name>/` with a consistent set of files:
- `<name>.route.ts` — Express Router, applies middleware chain
- `<name>.controller.ts` — thin request/response handlers, delegates to service
- `<name>.service.ts` — business logic and Mongoose queries
- `<name>.model.ts` — Mongoose schema + model
- `<name>.interface.ts` — TypeScript interfaces for the domain
- `<name>.validation.ts` — Zod schemas for request validation

Modules: `auth`, `user`.

All module routers are registered centrally in `src/routes/index.ts` under `/api/v1/<module>`.

### Request lifecycle

```
Request → auth middleware → authorize middleware → validateRequest (Zod) → controller → service → response
```

- **`asyncHandler`** (`src/utils/asyncHandler.ts`) — wraps async route handlers; forwards errors to the global error handler automatically.
- **`validateRequest`** (`src/middleware/validateRequest.ts`) — takes a Zod schema, calls `schema.parseAsync({ body: req.body })`, throws on failure.
- **`globalErrorHandler`** (`src/errors/globalErrorHandler.ts`) — centralised error handler handles `ApiError`, Zod errors, Mongoose validation/cast errors, and duplicate key (11000) errors.

### Auth

JWT-based, two tokens (access + refresh). The `auth` middleware verifies the Bearer token and attaches decoded payload to `req.user` (typed via `src/interface/index.d.ts`). The `authorize(roles)` middleware checks `req.user.role` against the allowed role list. Roles: `"admin"` | `"moderator"`.

The refresh token is stored as an `httpOnly` cookie (`refreshToken`) and also persisted on the User document for single-session enforcement. On login both tokens are issued; on refresh both are rotated.

### QueryBuilder

`src/builder/queryBuilder.ts` — chainable class wrapping a Mongoose `Query`. Use it for list endpoints:

```ts
const result = new QueryBuilder(Model.find(), req.query)
  .search(["field1", "field2"])   // regex search across fields
  .filter(["status", "category"]) // exact match on enumerable fields
  .sort()                         // ?sortBy=field&sortOrder=desc
  .paginate();                    // ?page=1&limit=10

const data = await result.modelQuery;
const meta = await result.countTotal(); // { page, limit, total, totalPage }
```

### Responses

All success responses use `sendResponse` (`src/utils/sendResponse.ts`):
```ts
sendResponse(res, 200, "message", data, meta?);
```

All errors use `new ApiError(statusCode, message, path?)` and are thrown — `asyncHandler` catches them and forwards to `globalErrorHandler`.

## Environment variables

Required vars are validated on startup in `src/config/index.ts` — the server throws if any are missing.

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string |
| `DB_NAME` | yes | Database name |
| `PORT` | no | Server port (default `5000`) |
| `NODE_ENV` | no | `development` / `production` |
| `JWT_ACCESS_SECRET` | yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | yes | Refresh token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | no | Access token expiry (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | no | Refresh token expiry (default `7d`) |
| `BCRYPT_SALT_ROUNDS` | no | bcrypt rounds (default `10`) |
| `RESEND_API_KEY` | yes | Resend email service API key |
| `RESEND_FROM_EMAIL` | yes | Sender address for transactional emails |
| `RESET_PASS_UI_LINK` | no | Frontend base URL used in password reset / welcome emails |
| `FRONTEND_URL` | no | Frontend base URL used in email verification links |
| `SUPER_ADMIN_NAME` / `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | no | Fallback super-admin seed values |

## API contracts

See `api-contract/` for the full request/response spec for each module.
