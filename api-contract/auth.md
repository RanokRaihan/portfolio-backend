# Auth API Contract

Base path: `/api/v1/auth`

All responses follow the shape:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "statusCode": 4xx | 5xx,
  "message": "...",
  "errorDetails": [ { "path": "...", "message": "..." } ]
}
```

---

## POST /login

Login with email and password.

**Auth:** none

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Validation:**
- `email` — valid email format
- `password` — 6–20 characters

**Response `200`:**
```json
{
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "needPasswordChange": false
  }
}
```

Sets `refreshToken` as an `httpOnly` cookie (1 year, `sameSite: none` in production).

Access token JWT payload includes: `_id`, `name`, `email`, `role`, `needPasswordChange`, `emailVerified`.

**Errors:**
| Status | Condition |
|---|---|
| 401 | Email not found or password mismatch |
| 400 | Validation failure |

---

## GET /current-user

Return the authenticated user's profile from the access token payload.

**Auth:** Bearer token required

**Request body:** none

**Response `200`:**
```json
{
  "data": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "needPasswordChange": false,
    "emailVerified": true
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid Bearer token |

---

## POST /logout

Clear the session.

**Auth:** none (reads `refreshToken` cookie)

**Request body:** none

**Response `200`:**
```json
{ "data": null }
```

Clears the `refreshToken` cookie. If the token is valid the stored token on the user document is also cleared.

---

## POST /refresh-token

Rotate both tokens using the `refreshToken` cookie.

**Auth:** none (reads `refreshToken` cookie)

**Request body:** none

**Response `200`:**
```json
{
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

Sets a new `refreshToken` cookie. The old token is invalidated (single-session enforcement).

**Errors:**
| Status | Condition |
|---|---|
| 401 | Cookie missing, token invalid/expired, or token doesn't match stored value |

---

## PATCH /change-password

Change the authenticated user's password.

**Auth:** Bearer token required

**Request body:**
```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password-min8"
}
```

**Validation:**
- `oldPassword` — required string
- `newPassword` — 8–20 characters

**Response `200`:**
```json
{ "data": null }
```

Sets `needPasswordChange` to `false`.

**Errors:**
| Status | Condition |
|---|---|
| 401 | Invalid old password or user not found |
| 400 | Validation failure |

---

## POST /send-verification-email

Send an email verification link to the authenticated user's email address.

**Auth:** Bearer token required

**Request body:** none

**Response `200`:**
```json
{ "data": null }
```

Token expires in 15 minutes. Rate-limited: cannot re-send within 5 minutes of the last request.

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
| 400 | Email already verified, or resend requested too soon |
| 500 | Email delivery failure (token is cleared on failure) |

---

## POST /verify-email

Verify the user's email with a token from the verification link.

**Auth:** none

**Request body:**
```json
{
  "token": "<hex-token-from-email>"
}
```

**Validation:**
- `token` — non-empty string

**Response `200`:**
```json
{ "data": null }
```

Sets `emailVerified: true` and `emailVerifiedAt` on the user. Token is consumed (single-use).

**Errors:**
| Status | Condition |
|---|---|
| 400 | Token not found or expired |

---

## POST /forgot-password

Request a password reset email.

**Auth:** none

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Validation:**
- `email` — valid email format

**Response `200`:**
```json
{ "data": null }
```

Token expires in 15 minutes. Rate-limited: cannot re-request within 5 minutes.

**Errors:**
| Status | Condition |
|---|---|
| 404 | No active account found with that email |
| 429 | Resend requested too soon (includes wait time in message) |
| 500 | Email delivery failure (token is cleared on failure) |

---

## POST /reset-password

Set a new password using the token from the reset email.

**Auth:** none

**Request body:**
```json
{
  "token": "<hex-token-from-email>",
  "newPassword": "new-password-min8"
}
```

**Validation:**
- `token` — non-empty string
- `newPassword` — 8–20 characters

**Response `200`:**
```json
{ "data": null }
```

Sets `needPasswordChange: false`. Token is consumed (single-use).

**Errors:**
| Status | Condition |
|---|---|
| 400 | Token not found or expired, or validation failure |
