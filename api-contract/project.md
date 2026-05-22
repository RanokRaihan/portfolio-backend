# Project API Contract

Base path: `/api/v1/project`

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

Create a new project.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
POST /api/v1/project
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "title": "My Portfolio Backend",
  "tagline": "A RESTful API for my developer portfolio",
  "summary": "Full-featured backend with auth, projects, and more built with Express and MongoDB.",
  "description": "Detailed description at least 50 characters long describing the project in depth.",
  "category": "BACKEND",
  "type": "PERSONAL",
  "complexity": "INTERMEDIATE",
  "myRole": "Solo Developer",
  "coverImage": "https://example.com/cover.png",
  "ogImage": "https://example.com/og.png",

  // Optional fields
  "highlights": ["JWT auth", "Zod validation", "Soft delete"],
  "challenges": "Designing a clean module structure that scales.",
  "lessons": "Keeping controllers thin and pushing logic to services pays off.",
  "techStack": {
    "backend": ["Node.js", "Express", "TypeScript"],
    "database": ["MongoDB", "Mongoose"],
    "devops": ["Railway"]
  },
  "thumbnailImage": "https://example.com/thumb.png",
  "images": ["https://example.com/ss1.png"],
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "demoGifUrl": "https://example.com/demo.gif",
  "tags": ["api", "portfolio", "typescript"],
  "status": "PUBLISHED",
  "frontendLiveUrl": "https://example.com",
  "backendLiveUrl": "https://api.example.com",
  "frontendRepoUrl": "https://github.com/user/frontend",
  "backendRepoUrl": "https://github.com/user/backend",
  "caseStudyUrl": "https://example.com/case-study",
  "npmUrl": "https://npmjs.com/package/example",
  "devToUrl": "https://dev.to/user/article",
  "figmaUrl": "https://figma.com/file/xxx",
  "linesOfCode": 3200,
  "githubStars": 14,
  "npmDownloads": 0,
  "activeUsers": 0,
  "teamSize": 1,
  "contributors": ["Alice", "Bob"],
  "metaTitle": "My Portfolio Backend — TypeScript + Express",
  "metaDescription": "A production-ready portfolio backend API.",
  "featured": false,
  "sortOrder": 0,
  "isFeaturedOnHome": false,
  "startedAt": "2024-01-01T00:00:00.000Z",
  "completedAt": "2024-06-01T00:00:00.000Z"
}
```

### Required fields

| Field         | Type     | Notes                                                               |
|---------------|----------|---------------------------------------------------------------------|
| `title`       | string   | 3–120 chars                                                         |
| `tagline`     | string   | 10–200 chars                                                        |
| `summary`     | string   | 20–500 chars                                                        |
| `description` | string   | min 50 chars                                                        |
| `category`    | enum     | `FULL_STACK` `FRONTEND` `BACKEND` `MOBILE` `CLI_TOOL` `LIBRARY` `API` `PACKAGE` `OTHER` |
| `type`        | enum     | `PERSONAL` `FREELANCE` `OPEN_SOURCE` `CLIENT` `HACKATHON` `OTHER`  |
| `complexity`  | enum     | `BEGINNER` `INTERMEDIATE` `ADVANCED`                                |
| `myRole`      | string   | 2–100 chars                                                         |
| `coverImage`  | string   | valid URL                                                           |
| `ogImage`     | string   | valid URL                                                           |

### Responses

**201 Created**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Project created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "addedBy": "665f0000000000000000000a",
    "title": "My Portfolio Backend",
    "slug": "my-portfolio-backend",
    "tagline": "A RESTful API for my developer portfolio",
    "summary": "Full-featured backend with auth, projects, and more.",
    "description": "Detailed description...",
    "category": "BACKEND",
    "type": "PERSONAL",
    "status": "DRAFT",
    "complexity": "INTERMEDIATE",
    "myRole": "Solo Developer",
    "featured": false,
    "sortOrder": 0,
    "isFeaturedOnHome": false,
    "isDeleted": false,
    "teamSize": 1,
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T10:00:00.000Z"
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
    { "path": "body.title", "message": "Title must be at least 3 characters" }
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

**409 Conflict** — slug already exists
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A project with this slug already exists"
}
```

---

## PATCH /:id

Update any field of a project by ID.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
PATCH /api/v1/project/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

All body fields are optional. At least one must be provided. Unknown keys are rejected.

```json
{
  "title": "Updated Title",
  "status": "PUBLISHED",
  "featured": true,
  "techStack": {
    "backend": ["Node.js", "Express", "TypeScript"],
    "database": ["MongoDB"]
  }
}
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project updated successfully",
  "data": { "...full updated project document..." }
}
```

**400 Bad Request** — empty body or Zod validation failure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "At least one field must be provided to update"
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — project does not exist or is soft-deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Project not found"
}
```

**409 Conflict** — updated slug collides with another project
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A project with this slug already exists"
}
```

---

## PATCH /:id/status

Change the status of a project.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
PATCH /api/v1/project/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "status": "PUBLISHED"
}
```

`status` is required. Allowed values: `DRAFT` `PUBLISHED` `ARCHIVED` `IN_PROGRESS` `COMING_SOON`.

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project status updated successfully",
  "data": { "...full updated project document..." }
}
```

**400 Bad Request** — missing or invalid status value  
**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Project not found"
}
```

---

## DELETE /:id

Soft-delete a project (sets `isDeleted`, `deletedBy`, `deletedAt`). The document is preserved in the database and excluded from all public and manage queries.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
DELETE /api/v1/project/:id
Authorization: Bearer <access_token>
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project deleted successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "My Portfolio Backend",
    "deletedAt": "2026-05-16T12:00:00.000Z"
  }
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — project does not exist or is already deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Project not found"
}
```

---

## GET /

Get all **published** projects. No authentication required.

### Query parameters

| Param            | Type    | Description                                                  |
|------------------|---------|--------------------------------------------------------------|
| `search`         | string  | Text search across `title`, `tagline`, `summary`, `tags`    |
| `category`       | enum    | Filter by category (e.g. `BACKEND`)                         |
| `type`           | enum    | Filter by type (e.g. `PERSONAL`)                            |
| `complexity`     | enum    | Filter by complexity (e.g. `INTERMEDIATE`)                  |
| `featured`       | boolean | Filter featured projects                                     |
| `isFeaturedOnHome` | boolean | Filter home-featured projects                              |
| `sortBy`         | string  | Field to sort by (default: `createdAt`)                     |
| `sortOrder`      | `asc` \| `desc` | Sort direction (default: `asc`)                   |
| `page`           | number  | Page number (default: `1`)                                  |
| `limit`          | number  | Results per page (default: `10`)                            |

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects retrieved successfully",
  "data": [ { "...project fields (no isDeleted/deletedBy/deletedAt)..." } ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPage": 5
  }
}
```

---

## GET /:id

Get a single **published** project by MongoDB ID. No authentication required.

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project retrieved successfully",
  "data": { "...project fields (no isDeleted/deletedBy/deletedAt)..." }
}
```

**404 Not Found** — project does not exist or is not published
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Project not found"
}
```

---

## GET /manage

Get **all** non-deleted projects regardless of status.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Query parameters

Supports all the same params as `GET /`, plus:

| Param    | Type | Description                                                              |
|----------|------|--------------------------------------------------------------------------|
| `status` | enum | Filter by status: `DRAFT` `PUBLISHED` `ARCHIVED` `IN_PROGRESS` `COMING_SOON` |

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects retrieved successfully",
  "data": [ { "...full project document..." } ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 55,
    "totalPage": 6
  }
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

---

## GET /manage/:id

Get any single non-deleted project by MongoDB ID (any status).

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project retrieved successfully",
  "data": { "...full project document..." }
}
```

**404 Not Found** — project does not exist or is soft-deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Project not found"
}
```
