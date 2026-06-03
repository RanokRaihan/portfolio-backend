# Skill API Contract

Base path: `/api/v1/skill`

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

## POST /

Add a new skill.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
POST /api/v1/skill
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "name": "TypeScript",
  "category": "LANGUAGE",
  "level": "ADVANCED",

  // Optional
  "iconUrl": "https://cdn.example.com/icons/typescript.svg",
  "iconName": "typescript",
  "featured": true,
  "sortOrder": 1
}
```

### Required fields

| Field      | Type   | Notes                                                                        |
|------------|--------|------------------------------------------------------------------------------|
| `name`     | string | 1–60 chars. Slug is auto-generated from name.                                |
| `category` | enum   | `FRONTEND` `BACKEND` `DATABASE` `DEVOPS` `LANGUAGE` `TOOL` `OTHER`          |
| `level`    | enum   | `FAMILIAR` `PROFICIENT` `ADVANCED` `EXPERT`                                  |

### Optional fields

| Field       | Type    | Notes                       |
|-------------|---------|-----------------------------|
| `iconUrl`   | string  | Must be a valid URL         |
| `iconName`  | string  | 1–60 chars                  |
| `featured`  | boolean | Default `false`             |
| `sortOrder` | number  | Non-negative integer, default `0` |

### Responses

**201 Created**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Skill created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "addedBy": "665f0000000000000000000a",
    "name": "TypeScript",
    "slug": "typescript",
    "category": "LANGUAGE",
    "level": "ADVANCED",
    "iconUrl": "https://cdn.example.com/icons/typescript.svg",
    "iconName": "typescript",
    "featured": true,
    "sortOrder": 1,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**400 Bad Request** — Zod validation failure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": [
    { "path": "body.category", "message": "Category must be one of: FRONTEND, BACKEND, ..." }
  ]
}
```

**401 Unauthorized** — missing or invalid token
```json
{
  "success": false,
  "statusCode": 401,
  "message": "you are not authorized!"
}
```

**403 Forbidden** — insufficient role
```json
{
  "success": false,
  "statusCode": 401,
  "message": "You are not authorized !"
}
```

**409 Conflict** — skill name already exists
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A skill with this name already exists"
}
```

---

## PATCH /:id

Update a skill by MongoDB ID.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
PATCH /api/v1/skill/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

All fields are optional. At least one must be provided. Unknown keys are rejected. If `name` is updated, `slug` is regenerated automatically.

```json
{
  "level": "EXPERT",
  "featured": true,
  "sortOrder": 0
}
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Skill updated successfully",
  "data": { "...full updated skill document..." }
}
```

**400 Bad Request** — empty body or validation failure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "At least one field must be provided to update"
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Skill not found"
}
```

**409 Conflict** — updated name collides with an existing skill
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A skill with this name already exists"
}
```

---

## DELETE /:id

Permanently delete a skill by MongoDB ID (hard delete).

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
DELETE /api/v1/skill/:id
Authorization: Bearer <access_token>
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Skill deleted successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "TypeScript"
  }
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Skill not found"
}
```

---

## GET /:id

Get a single skill by MongoDB ID. No authentication required. `addedBy` is excluded from the response.

### Request

```http
GET /api/v1/skill/:id
```

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Skill retrieved successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "TypeScript",
    "slug": "typescript",
    "category": "LANGUAGE",
    "level": "ADVANCED",
    "iconUrl": "https://cdn.example.com/icons/typescript.svg",
    "iconName": "typescript",
    "featured": true,
    "sortOrder": 1,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**404 Not Found**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Skill not found"
}
```

---

## GET /

Get all skills. No authentication required.

Optionally filter by category. Results are sorted by `sortOrder` ascending, then `name` ascending. `addedBy` is excluded from the response.

### Query parameters

| Param      | Type   | Description                                                                  |
|------------|--------|------------------------------------------------------------------------------|
| `category` | enum   | Filter by category: `FRONTEND` `BACKEND` `DATABASE` `DEVOPS` `LANGUAGE` `TOOL` `OTHER` |

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Skills retrieved successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "TypeScript",
      "slug": "typescript",
      "category": "LANGUAGE",
      "level": "ADVANCED",
      "iconUrl": "https://cdn.example.com/icons/typescript.svg",
      "iconName": "typescript",
      "featured": true,
      "sortOrder": 1,
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```
