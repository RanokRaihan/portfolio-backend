# Site Settings API Contract

Base path: `/api/v1/setting`

Single-document collection — only one settings document ever exists.

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
  "statusCode": "4xx | 5xx",
  "message": "...",
  "errorDetails": [ { "path": "...", "message": "..." } ]
}
```

---

## POST /

Create site settings. Can only be called once — returns `409` if settings already exist.

**Auth:** Bearer token required. Role: `admin` only.

### Request

```http
POST /api/v1/setting
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "name": "Ranok Raihan",

  // Optional
  "title": "Full Stack Developer",
  "bio": "I build scalable web applications.",
  "avatar": "https://cdn.example.com/avatar.png",
  "resumeUrl": "https://cdn.example.com/resume.pdf",
  "openToWork": true,
  "availableFrom": "2026-06-01",
  "socials": {
    "github": "https://github.com/ranokraihan",
    "linkedin": "https://linkedin.com/in/ranokraihan",
    "twitter": "https://twitter.com/ranokraihan",
    "devTo": "https://dev.to/ranokraihan",
    "youtube": "https://youtube.com/@ranokraihan",
    "email": "ranok@example.com"
  },
  "metaTitle": "Ranok Raihan – Full Stack Developer",
  "metaDescription": "Portfolio of Ranok Raihan, Full Stack Developer.",
  "ogImage": "https://cdn.example.com/og.png",
  "footerText": "© 2026 Ranok Raihan. All rights reserved."
}
```

### Required fields

| Field  | Type   | Notes         |
|--------|--------|---------------|
| `name` | string | 1–100 chars   |

### Optional fields

| Field               | Type    | Notes                                                    |
|---------------------|---------|----------------------------------------------------------|
| `title`             | string  | Max 150 chars                                            |
| `bio`               | string  | Max 2000 chars                                           |
| `avatar`            | string  | Must be a valid URL                                      |
| `resumeUrl`         | string  | Must be a valid URL                                      |
| `openToWork`        | boolean | Default `false`                                          |
| `availableFrom`     | date    | ISO 8601                                                 |
| `socials`           | object  | See nested fields below                                  |
| `socials.github`    | string  | Must be a valid URL                                      |
| `socials.linkedin`  | string  | Must be a valid URL                                      |
| `socials.twitter`   | string  | Must be a valid URL                                      |
| `socials.devTo`     | string  | Must be a valid URL                                      |
| `socials.youtube`   | string  | Must be a valid URL                                      |
| `socials.email`     | string  | Must be a valid email address                            |
| `metaTitle`         | string  | Max 100 chars                                            |
| `metaDescription`   | string  | Max 300 chars                                            |
| `ogImage`           | string  | Must be a valid URL                                      |
| `footerText`        | string  | Max 300 chars                                            |

### Responses

**201 Created**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Site settings created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Ranok Raihan",
    "title": "Full Stack Developer",
    "bio": "I build scalable web applications.",
    "avatar": "https://cdn.example.com/avatar.png",
    "resumeUrl": "https://cdn.example.com/resume.pdf",
    "openToWork": true,
    "availableFrom": "2026-06-01T00:00:00.000Z",
    "socials": {
      "github": "https://github.com/ranokraihan",
      "linkedin": "https://linkedin.com/in/ranokraihan",
      "twitter": "https://twitter.com/ranokraihan",
      "devTo": "https://dev.to/ranokraihan",
      "youtube": "https://youtube.com/@ranokraihan",
      "email": "ranok@example.com"
    },
    "metaTitle": "Ranok Raihan – Full Stack Developer",
    "metaDescription": "Portfolio of Ranok Raihan, Full Stack Developer.",
    "ogImage": "https://cdn.example.com/og.png",
    "footerText": "© 2026 Ranok Raihan. All rights reserved.",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**409 Conflict** — settings already exist
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Site settings already exist. Use PATCH to update."
}
```

**400 Bad Request** — validation failure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": [
    { "path": "body.name", "message": "Name is required" }
  ]
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role (non-admin)

---

## PATCH /

Update site settings. All fields are optional; at least one must be provided. Unknown keys are rejected.

**Partial `socials` update is supported** — only the provided social keys are updated; others are preserved.

**Auth:** Bearer token required. Role: `admin` only.

### Request

```http
PATCH /api/v1/setting
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "openToWork": false,
  "socials": {
    "github": "https://github.com/ranokraihan-new"
  }
}
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Site settings updated successfully",
  "data": { "...full updated settings document..." }
}
```

**400 Bad Request** — empty body or validation failure

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — settings not yet created
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Site settings not found. Use POST to create them first."
}
```

---

## GET /

Get site settings. No authentication required. Strips `updatedAt` from the response.

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Site settings retrieved successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Ranok Raihan",
    "title": "Full Stack Developer",
    "bio": "I build scalable web applications.",
    "avatar": "https://cdn.example.com/avatar.png",
    "resumeUrl": "https://cdn.example.com/resume.pdf",
    "openToWork": true,
    "socials": {
      "github": "https://github.com/ranokraihan",
      "linkedin": "https://linkedin.com/in/ranokraihan",
      "email": "ranok@example.com"
    },
    "metaTitle": "Ranok Raihan – Full Stack Developer",
    "metaDescription": "Portfolio of Ranok Raihan, Full Stack Developer.",
    "ogImage": "https://cdn.example.com/og.png",
    "footerText": "© 2026 Ranok Raihan. All rights reserved.",
    "createdAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**404 Not Found** — settings not yet created
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Site settings not found"
}
```

---

## GET /admin

Get full site settings including all fields. Requires authentication.

**Auth:** Bearer token required. Role: `admin` only.

### Request

```http
GET /api/v1/setting/admin
Authorization: Bearer <access_token>
```

### Response — 200 OK

Same shape as `GET /` but includes all fields (`updatedAt`, etc.).

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role  
**404 Not Found** — settings not yet created
