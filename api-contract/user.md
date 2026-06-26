# User API Contract

Base path: `/api/v1/user`

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

**Roles:** `admin` | `moderator`

The `SAFE_USER_FIELDS` projection omits: `password`, `refreshToken`, `passwordResetToken`, `passwordResetTokenExpires`, `emailVerificationToken`, `emailVerificationTokenExpires`.

---

## GET /

Get all users with pagination, search, and role filtering.

**Auth:** Bearer token required — `admin` or `moderator`

**Query params:**
| Param | Description |
|---|---|
| `searchTerm` | Regex search across `name` and `email` |
| `role` | Exact filter: `admin` \| `moderator` |
| `sortBy` | Field to sort by (default: `createdAt`) |
| `sortOrder` | `asc` \| `desc` (default: `desc`) |
| `page` | Page number (default: `1`) |
| `limit` | Results per page (default: `10`) |

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://...",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "address": "123 Main St",
      "phone": "+1234567890",
      "role": "moderator",
      "emailVerified": true,
      "emailVerifiedAt": "2024-01-01T00:00:00.000Z",
      "needPasswordChange": false,
      "isActive": true,
      "isDeleted": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPage": 5
  }
}
```

---

## POST /seed-super-admin

Create the first admin user. Fails if any admin already exists.

**Auth:** none

**Request body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "min8chars",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

**Validation:**
- `name` — 1–100 characters
- `email` — valid email
- `password` — 8–20 characters
- `dateOfBirth` — valid date string, user must be at least 13
- `gender` — `male` | `female` | `other`
- `address` — 1–300 characters
- `phone` — 1–20 characters

**Response `201`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "address": "123 Main St",
    "phone": "+1234567890",
    "role": "admin"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 409 | An admin already exists, or email already in use |
| 400 | Validation failure |

---

## POST /create-user

Create a new moderator user. Sends a welcome email with a temporary password.

**Auth:** Bearer token required — `admin`

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "dateOfBirth": "1995-06-15",
  "gender": "female",
  "address": "456 Elm St",
  "phone": "+0987654321"
}
```

**Validation:**
- `name` — 1–100 characters
- `email` — valid email
- `dateOfBirth` — valid date string, user must be at least 13
- `gender` — `male` | `female` | `other`
- `address` — 1–300 characters
- `phone` — 1–20 characters

**Response `201`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "dateOfBirth": "1995-06-15T00:00:00.000Z",
    "gender": "female",
    "address": "456 Elm St",
    "phone": "+0987654321",
    "role": "moderator"
  }
}
```

A temporary password is auto-generated and emailed to the user. `needPasswordChange` is set to `true`. If email delivery fails, the user is deleted and a 500 is returned.

**Errors:**
| Status | Condition |
|---|---|
| 400 | Email already in use, or validation failure |
| 500 | Welcome email delivery failure (user creation rolled back) |

---

## GET /me

Get the authenticated user's own profile.

**Auth:** Bearer token required

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "address": "123 Main St",
    "phone": "+1234567890",
    "role": "moderator",
    "emailVerified": true,
    "emailVerifiedAt": "2024-01-01T00:00:00.000Z",
    "needPasswordChange": false,
    "isActive": true,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |

---

## PATCH /me

Update the authenticated user's own profile fields.

**Auth:** Bearer token required

**Request body** (all fields optional, at least one expected):
```json
{
  "name": "Updated Name",
  "dateOfBirth": "1991-03-20",
  "gender": "other",
  "address": "789 Oak Ave",
  "phone": "+1122334455"
}
```

**Validation:**
- `name` — 1–100 characters (optional)
- `dateOfBirth` — valid date string, user must be at least 13 (optional)
- `gender` — `male` | `female` | `other` (optional)
- `address` — 1–300 characters (optional)
- `phone` — 1–20 characters (optional)

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Updated Name",
    "email": "john@example.com",
    "dateOfBirth": "1991-03-20T00:00:00.000Z",
    "gender": "other",
    "address": "789 Oak Ave",
    "phone": "+1122334455",
    "role": "moderator"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
| 400 | Validation failure |

---

## PATCH /me/avatar

Update the authenticated user's avatar URL.

**Auth:** Bearer token required

**Request body:**
```json
{
  "image": "https://example.com/avatar.jpg"
}
```

**Validation:**
- `image` — valid URL string

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/avatar.jpg"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
| 400 | Validation failure (invalid URL) |

---

## GET /:id

Get a specific user by ID.

**Auth:** Bearer token required — `admin` or `moderator`

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "image": "https://...",
    "dateOfBirth": "1995-06-15T00:00:00.000Z",
    "gender": "female",
    "address": "456 Elm St",
    "phone": "+0987654321",
    "role": "moderator",
    "emailVerified": false,
    "needPasswordChange": true,
    "isActive": true,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

Soft-deleted users (`isDeleted: true`) return 404.

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found or soft-deleted |

---

## PATCH /:id/status

Activate or deactivate a user.

**Auth:** Bearer token required — `admin`

**Request body:**
```json
{
  "isActive": false
}
```

**Validation:**
- `isActive` — boolean, required

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "moderator",
    "isActive": false
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
| 400 | Validation failure |

---

## PATCH /:id/role

Change a user's role.

**Auth:** Bearer token required — `admin`

**Request body:**
```json
{
  "role": "moderator"
}
```

**Validation:**
- `role` — `admin` | `moderator`

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "moderator",
    "isActive": true
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
| 400 | Validation failure |

---

## DELETE /:id

Soft-delete a user (sets `isDeleted: true`, `isActive: false`).

**Auth:** Bearer token required — `admin`

**Response `200`:**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 404 | User not found |
