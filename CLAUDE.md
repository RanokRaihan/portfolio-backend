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

Modules: `auth`, `user`, `skill`, `project`, `blog`, `dashboard`, `email`.

All module routers are registered centrally in `src/routes/index.ts` under `/api/v1/<module>`.

### Request lifecycle

```
Request → auth middleware → authorize middleware → bodyParser (multipart) → validateRequest (Zod) → controller → service → response
```

- **`asyncHandler`** (`src/utils/asyncHandler.ts`) — wraps async route handlers; forwards errors to the global error handler automatically.
- **`validateRequest`** (`src/middleware/validateRequest.ts`) — takes a Zod schema, calls `schema.parseAsync({ body: req.body })`, throws on failure.
- **`bodyParser`** (`src/middleware/bodyParser.middleware.ts`) — for multipart form routes: parses the stringified JSON in `req.body.data` back into `req.body`. Must be applied after `multer` and before `validateRequest`.
- **`globalErrorHandler`** (`src/errors/globalErrorHandler.ts`) — centralised error handler handles `ApiError`, Zod errors, Mongoose validation/cast errors, and duplicate key (11000) errors.

### Auth

JWT-based, two tokens (access + refresh). The `auth` middleware verifies the Bearer token and attaches decoded payload to `req.user` (typed via `src/interface/index.d.ts`). The `authorize(roles)` middleware checks `req.user.role` against the allowed role list. Roles: `"admin"` | `"moderator"`.

### Image uploads

Multer stores files temporarily in `uploads/`, then `uploadToCloudinary` in `src/utils/handleImageUpload.ts` uploads them to Cloudinary (folder: `portfolio-image`) and deletes the local file. For routes with image uploads, the middleware order must be: `upload.fields(...)` → `bodyParser` → `validateRequest`.

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

Required in `.env` (see `src/config/index.ts` for the full list):

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `PORT` | Server port |
| `NODE_ENV` | `development` / `production` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token expiry |
| `BCRYPT_SALT_ROUNDS` | bcrypt rounds |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `RESET_PASS_UI_LINK` | Frontend URL for password reset emails |
