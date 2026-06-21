# Pre-Deployment Security & Quality Audit

**Date:** 2026-06-20  
**Branch:** `api-remodel`  
**Auditor:** Claude Code (automated review)  
**Scope:** Full source audit of `src/` — security, correctness, performance, and maintainability

---

## Severity Legend

| Level | Meaning |
|---|---|
| **CRITICAL** | Exploit or data breach risk; block deployment |
| **HIGH** | Significant security or correctness issue; fix before go-live |
| **MEDIUM** | Meaningful risk or bug; fix soon after launch |
| **LOW** | Code quality, maintainability, or minor inconsistency |

---

## Summary Scorecard

| Category | Critical | High | Medium | Low |
|---|---|---|---|---|
| Security | 3 | 5 | 3 | 2 |
| Correctness / Logic | 0 | 2 | 4 | 1 |
| Performance | 0 | 0 | 2 | 1 |
| Maintainability | 0 | 0 | 1 | 5 |
| **Total** | **3** | **7** | **10** | **9** |

---

## Critical Issues

### C-1 — `bcrypt` salt rounds hardcoded and below minimum

**File:** `src/modules/user/user.model.ts:104`

```ts
user.password = await bcrypt.hash(user.password, 8);
```

The salt rounds are hardcoded to `8`, completely ignoring the `config.bcrypt.saltRounds` value that is read from `BCRYPT_SALT_ROUNDS` env var. The recommended minimum is `10`; for 2024+ deployments, `12` is more appropriate. At 8 rounds, a powerful GPU can crack a bcrypt hash in seconds.

**Fix:**
```ts
user.password = await bcrypt.hash(user.password, Number(config.bcrypt.saltRounds));
```
Also set `BCRYPT_SALT_ROUNDS=12` in `.env`.

---

### C-2 — `POST /api/v1/user/seed-super-admin` is publicly accessible with no protection

**File:** `src/modules/user/user.route.ts:37-41`

```ts
userRouter.post(
  "/seed-super-admin",
  validateRequest(seedSuperAdminSchema),
  seedSuperAdminController,  // no auth, no secret
);
```

Any unauthenticated actor who hits this endpoint before the legitimate admin can become the super-admin. The only guard is a DB check for an existing admin — a race condition on first deploy. The endpoint remains live in production indefinitely.

**Fix:** One of the following:
- Require a `SEED_SECRET` header matched against an env var.
- Remove the endpoint entirely and seed via a one-off CLI script (`npm run seed`).
- Gate behind `NODE_ENV === 'development'` at minimum.

---

### C-3 — Refresh tokens and reset tokens stored in plain text in MongoDB

**Files:**  
- `src/modules/user/user.model.ts` — `refreshToken`, `passwordResetToken`, `emailVerificationToken` fields  
- `src/modules/auth/auth.service.ts` — stored directly without hashing

If the database is compromised (MongoDB Atlas credentials leaked, injection, etc.), all active refresh tokens and password-reset tokens are immediately usable by an attacker to hijack every session and trigger account takeovers.

**Fix:** Store a `crypto.createHash('sha256').update(token).digest('hex')` of the token. Compare by hashing the incoming token before the DB lookup. The raw token is only ever in memory and sent to the user once.

---

## High Issues

### H-1 — Refresh token validation does not check stored DB token (broken single-session enforcement)

**File:** `src/modules/auth/auth.service.ts:16-57`

`refreshAuthTokenService` verifies the JWT signature but never compares the incoming token against `user.refreshToken` in the database. Logout calls `clearRefreshTokenService` which removes the DB token, but **any token issued before logout will still pass verification** because only the signature is checked. This makes logout non-functional from a security standpoint.

**Fix:**
```ts
const user = await User.findOne({ _id: decoded._id, isDeleted: false });
if (!user || user.refreshToken !== token) {  // ← add this check
  throw new ApiError(401, "Invalid refresh token");
}
```

---

### H-2 — Email notification template renders user input as raw HTML (internal XSS)

**File:** `src/utils/emailTemplates.ts:308-439` (`newMessageNotificationTemplate`)

The `name`, `email`, `subject`, and `message` fields from the contact form are interpolated directly into HTML:
```ts
<p style="...">${name}</p>
...
<div style="...white-space:pre-wrap;">${message}</div>
```

An attacker submitting `<script>...</script>` or `<img src=x onerror=...>` as their name or message will inject that into the admin notification email. Some email clients render this. The `message` field is particularly dangerous since it uses `white-space:pre-wrap` inside a `div`, not a `<pre>` tag.

**Fix:** Escape all user-supplied values before interpolating into HTML:
```ts
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
```

---

### H-3 — `POST /api/v1/testimonial` (public) has no rate limiter

**File:** `src/modules/testimonial/testimonial.route.ts:25-28`

The public testimonial submission endpoint has no rate limiting. The contact form correctly applies `createRateLimiter`. Any actor can spam thousands of testimonial submissions, filling the database and potentially triggering admin notifications.

**Fix:** Apply the same rate limiter pattern used in `message.route.ts`:
```ts
const testimonialRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 3 });
testimonialRouter.post("/", testimonialRateLimiter, validateRequest(createTestimonialSchema), createTestimonialController);
```

---

### H-4 — `sameSite` cookie attribute is inconsistent between login and token refresh

**Files:**  
- `src/modules/auth/auth.controller.ts:59-65` — login sets `sameSite: "none"` in production  
- `src/modules/auth/auth.controller.ts:185-190` — refresh sets `sameSite: "strict"`

A cookie set with `sameSite: "none"` requires `secure: true` (HTTPS only). More importantly, the two endpoints set different `sameSite` policies, which means the refresh endpoint may reject the cookie the login endpoint sent, or vice versa depending on the client. Decide on one consistent policy (`"none"` for cross-origin dashboards, `"strict"` for same-origin).

---

### H-5 — Refresh cookie `maxAge` is hardcoded to 1 year in login, not synced with JWT expiry

**File:** `src/modules/auth/auth.controller.ts:63`

```ts
maxAge: 1000 * 60 * 60 * 24 * 365,  // 1 year, ignores JWT_REFRESH_EXPIRES_IN
```

The refresh token controller correctly uses `parseExpiryToMs(config.jwt.refreshExpiresIn)`. The login controller ignores this value entirely. A user's cookie will survive 1 year even if the JWT inside it expires in 7 days, which means the browser will keep sending a stale, useless cookie.

**Fix:**
```ts
maxAge: parseExpiryToMs(config.jwt.refreshExpiresIn),
```

---

### H-6 — `GET /auth/forgot-password` and `GET /auth/verify-email` have no rate limiter middleware

**File:** `src/modules/auth/auth.route.ts:50-59`

While `forgotPasswordService` has a per-user time gate (5-min cooldown), it requires finding the user first. An attacker can probe the endpoint to enumerate valid email addresses: a 404 confirms an email doesn't exist, a 429 or 200 confirms it does. Additionally, there's no global IP-based rate limit to slow enumeration across many email addresses.

**Fix:** Apply `createRateLimiter` to `/forgot-password` and `/verify-email`. Consider returning a generic "if this email exists, a link was sent" response even on 404.

---

### H-7 — Refresh token accepted from request body (XSS escalation path)

**File:** `src/modules/auth/auth.controller.ts:170`

```ts
const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
```

Accepting the refresh token in the request body means any XSS vulnerability anywhere on the frontend can steal and replay the refresh token. The httpOnly cookie exists precisely to prevent this. The body fallback defeats the cookie's security.

**Fix:** Remove `req.body.refreshToken` and only accept from `req.cookies.refreshToken`.

---

## Medium Issues

### M-1 — Authorization errors return HTTP 401 instead of 403

**File:** `src/middleware/authorize.middleware.ts:14-15`

```ts
if (!roles.includes(user.role)) {
  throw new ApiError(401, " You are not authorized !");
```

HTTP 401 means "you need to authenticate." HTTP 403 means "you are authenticated but not permitted." Using 401 for role failures tells the client it should re-authenticate, which is wrong — the user is already authenticated. Many frontend frameworks use this status to redirect to login.

**Fix:** Change `401` to `403` for the role-check path.

---

### M-2 — Email template claims link expires in 24 hours; code sets 15 minutes

**File:**  
- `src/utils/emailTemplates.ts:126` — `"This link expires in 24 hours."`  
- `src/modules/auth/auth.service.ts:102` — `const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes`

The user receives an email saying the verification link is valid for 24 hours, but the link actually expires in 15 minutes. This is a trust/UX bug that will cause user confusion and support requests.

**Fix:** Align the template text with the actual 15-minute expiry, or change expiry to 24 hours.

---

### M-3 — `QueryBuilder.search()` passes unescaped user input to MongoDB `$regex` (ReDoS risk)

**File:** `src/builder/queryBuilder.ts:15-22`

```ts
const searchTerm = this.query.search;
if (searchTerm) {
  this.modelQuery = this.modelQuery.find({
    $or: searchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });
}
```

`searchTerm` is taken directly from `req.query.search` with no sanitization. Patterns like `(a+)+`, `.*.*.*`, or extremely long inputs can cause catastrophic backtracking in MongoDB's regex engine, leading to a CPU spike that effectively denial-of-services the database. This affects every public list endpoint.

**Fix:** Escape the search string before passing to `$regex`:
```ts
const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
```
Optionally, add a `maxLength` check (e.g., reject if `> 100` chars).

---

### M-4 — No pagination `limit` cap in `QueryBuilder.paginate()`

**File:** `src/builder/queryBuilder.ts:47-53`

```ts
const limit = parseInt(this?.query?.limit, 10) || 10;
```

A client can request `?limit=100000`, causing MongoDB to fetch and serialize tens of thousands of documents in a single response. This is a resource exhaustion / DoS vector on every list endpoint.

**Fix:**
```ts
const rawLimit = parseInt(this?.query?.limit, 10) || 10;
const limit = Math.min(rawLimit, 100);  // cap at 100
```

---

### M-5 — Blog slug auto-generation is not uniqueness-safe

**File:** `src/modules/blog/blog.model.ts:54-63`

The blog's pre-validate hook generates a slug from the title but does not check for collisions (unlike the Project model, which does a `distinct` query). Two blogs with the same title will both attempt to use the same slug, and the second will fail at the database level with a duplicate key error — a 500 that leaks Mongoose internals to the caller.

**Fix:** Either apply the same `distinct`-based uniqueness check used in `project.model.ts`, or add a slug suffix on duplicate key error in the service layer.

---

### M-6 — `sendVerificationEmailSchema` is defined but never applied to its route

**File:** `src/modules/auth/auth.route.ts:41-43`

```ts
authRouter.post(
  "/send-verification-email",
  auth,
  sendVerificationEmailController,  // ← validateRequest(sendVerificationEmailSchema) is missing
);
```

The schema is imported and defined in `auth.validation.ts` but the middleware call is absent from the route definition. The controller uses `req.user.email` (from JWT), so the missing validation doesn't cause a runtime bug — but the schema is dead code that signals an incomplete intent.

**Fix:** Either remove `sendVerificationEmailSchema` from the file entirely, or add the middleware: `validateRequest(sendVerificationEmailSchema)`. Since the controller reads from the token anyway, the schema could be deleted.

---

### M-7 — Login password min-length (6 chars) is shorter than change/reset min-length (8 chars)

**Files:**  
- `src/modules/auth/auth.validation.ts:8` — login: `.min(6, ...)`  
- `src/modules/auth/auth.validation.ts:20` — change password: `.min(8, ...)`

The login route permits 6-character passwords but the change-password and reset-password routes require 8+. A user seeded with a 7-character password could log in but would hit a validation error on the change-password form. The minimum length should be consistent everywhere — 8 chars minimum.

---

### M-8 — Double DB query pattern in `updateMessageStatusService`

**File:** `src/modules/message/message.service.ts:62-78`

The service fetches the contact by ID to check existence, then calls `findByIdAndUpdate` separately. This is two round-trips. `findByIdAndUpdate` already returns `null` if no document is found, so the existence check can be done in a single query.

**Fix:**
```ts
const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
if (!updated) throw new ApiError(404, "Message not found", "updateMessageStatus");
return updated;
```

---

## Low Issues

### L-1 — No HTTP security headers (missing Helmet)

**File:** `src/app.ts`

The application has no security header middleware. This means:
- No `Strict-Transport-Security` (HSTS)
- No `X-Content-Type-Options: nosniff`
- No `X-Frame-Options: DENY`
- No `Content-Security-Policy`
- Express version disclosed via `X-Powered-By`

**Fix:** `npm install helmet` and add `app.use(helmet())` before routes.

---

### L-2 — No request body size limit

**File:** `src/app.ts:13`

```ts
app.use(express.json());
```

No `limit` option is set. Express 5 defaults to `100kb` for JSON, but blog content could be much larger. More critically, there is no upper bound enforced at the application layer — a crafted large payload in the blog content or description fields could consume significant memory.

**Fix:**
```ts
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
```

---

### L-3 — `nodemailer` is installed but never used

**File:** `package.json` (dependencies)

`nodemailer` (`^7.0.3`) is in `dependencies` but is never imported anywhere in `src/`. All email is sent via `resend`. This is dead weight in the production bundle and a potential source of supply-chain CVEs.

**Fix:** `npm uninstall nodemailer` and remove `@types/nodemailer` from devDependencies.

---

### L-4 — `iterm2.sh` and `.DS_Store` files are tracked in git

**Files:** `.DS_Store`, `iterm2.sh`, `src/.DS_Store`, `src/modules/.DS_Store`

These are local development artifacts that have no place in a version-controlled repository. They reveal development environment details and clutter the repo.

**Fix:**
```bash
git rm --cached .DS_Store src/.DS_Store src/modules/.DS_Store iterm2.sh
```
Add to `.gitignore`:
```
**/.DS_Store
iterm2.sh
```

---

### L-5 — Personal email hardcoded as fallback in config

**File:** `src/config/index.ts:81`

```ts
myEmail: process.env.MY_EMAIL || "ranokraihan@gmail.com",
```

A personal email address is hardcoded as a runtime fallback. If `MY_EMAIL` is not set in production, all contact form notifications go to this address by default. This is a privacy/configuration concern — the env var should simply be required.

---

### L-6 — `auth.controller.ts` imports `SignOptions` directly from `node_modules` path

**File:** `src/modules/auth/auth.controller.ts:11`

```ts
import { SignOptions } from "./../../../node_modules/@types/jsonwebtoken/index.d";
```

This is a fragile, non-standard import. It bypasses TypeScript's module resolution and will break if `node_modules` is restructured. This is already imported correctly in `auth.service.ts` as `import jwt, { SignOptions } from "jsonwebtoken"`.

**Fix:**
```ts
import jwt, { SignOptions } from "jsonwebtoken";
```

---

### L-7 — Multiple `Resend` client instances created

**Files:**  
- `src/modules/auth/auth.service.ts:14`  
- `src/modules/user/user.service.ts:11`  
- `src/modules/message/message.service.ts:9`

Each module creates its own `new Resend(config.resend.apiKey)` instance. These should be a single shared singleton to avoid redundant object creation and make API key rotation a single-file change.

**Fix:** Create `src/lib/resend.ts`:
```ts
import { Resend } from "resend";
import { config } from "../config";
export const resend = new Resend(config.resend.apiKey);
```

---

### L-8 — No request/access logging

**File:** `src/app.ts`

There is no HTTP access logging (no `morgan` or equivalent). In production, this makes it impossible to audit which endpoints were hit, by whom, and with what latency — critical for post-incident analysis.

**Fix:** `npm install morgan` + `npm install -D @types/morgan`, then:
```ts
if (config.nodeEnv !== "test") app.use(morgan("combined"));
```

---

### L-9 — `QueryBuilder.sort()` allows sorting by arbitrary field names

**File:** `src/builder/queryBuilder.ts:27-29`

```ts
const sortBy = this.query.sortBy || "createdAt";
this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
```

Any string can be passed as `sortBy`. While Mongoose will silently ignore sort fields that don't exist on the schema, this is an unnecessary attack surface. An allowlist of valid sort fields should be enforced per endpoint.

---

## Positive Observations

These things are done well and should be preserved:

- **Fail-fast config validation** — `src/config/index.ts` throws on missing required env vars at startup. Excellent practice.
- **`asyncHandler` wrapper** — Clean, consistent error forwarding throughout all controllers.
- **`SAFE_USER_FIELDS` constant** — Password and tokens are explicitly excluded from all user projections.
- **Soft delete pattern** — Consistent `isDeleted` flag across most models keeps data recoverable.
- **Zod `.strict()` on all request schemas** — Prevents unknown fields from passing through to the service layer.
- **Per-user rate gate on `forgotPassword` and `sendVerificationEmail`** — Token expiry timestamp used to throttle re-sends at the service level.
- **Slug uniqueness in Project and Skill models** — The `distinct` + regex approach correctly handles concurrent creation without N+1 loop queries.
- **`Promise.all` in `getStatsService`** — All aggregate queries are issued in parallel. Correct.
- **`sendResponse` utility** — Consistent response envelope across all 200 responses.
- **DB index coverage** — Relevant fields are indexed on every model (slug, status, featured, isDeleted).

---

## Deployment Checklist

Before going live, ensure these are done in order:

- [ ] **C-1** Fix bcrypt salt rounds: `Number(config.bcrypt.saltRounds)`, set `BCRYPT_SALT_ROUNDS=12`
- [ ] **C-2** Remove or protect `/user/seed-super-admin` with a secret key
- [ ] **C-3** Hash tokens before DB storage (refresh, reset, verification)
- [ ] **H-1** Validate stored refresh token against DB in `refreshAuthTokenService`
- [ ] **H-2** HTML-escape user inputs in email templates
- [ ] **H-3** Add rate limiter to `POST /testimonial`
- [ ] **H-4** Make `sameSite` consistent across login and refresh token cookies
- [ ] **H-5** Sync refresh cookie `maxAge` with `parseExpiryToMs(config.jwt.refreshExpiresIn)`
- [ ] **H-6** Add rate limiter to `/forgot-password` and `/verify-email`
- [ ] **H-7** Remove `req.body.refreshToken` fallback in refresh token controller
- [ ] **M-1** Change role failure status code from 401 → 403
- [ ] **M-2** Fix email template expiry text: "15 minutes" not "24 hours"
- [ ] **M-3** Escape `searchTerm` before passing to MongoDB `$regex`
- [ ] **M-4** Cap `limit` at 100 in `QueryBuilder.paginate()`
- [ ] **M-5** Add slug uniqueness check to Blog model (match Project model)
- [ ] **L-1** Install and configure `helmet`
- [ ] **L-2** Set body size limit on `express.json()`
- [ ] **L-3** Remove unused `nodemailer` dependency
- [ ] **L-4** Remove `.DS_Store` and `iterm2.sh` from git history
- [ ] **L-6** Fix `node_modules` import in `auth.controller.ts`
- [ ] **L-8** Add request logging (`morgan`)
