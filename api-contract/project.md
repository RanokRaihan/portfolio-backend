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

  // Optional fields
  "slug": "my-portfolio-backend",
  "highlights": ["JWT auth", "Zod validation", "Soft delete"],
  "challenges": "Designing a clean module structure that scales.",
  "lessons": "Keeping controllers thin and pushing logic to services pays off.",
  "techStack": {
    "backend": ["Node.js", "Express", "TypeScript"],
    "database": ["MongoDB", "Mongoose"],
    "devops": ["Railway"]
  },
  "coverImage": "https://example.com/cover.png",
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
  "ogImage": "https://example.com/og.png",
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
