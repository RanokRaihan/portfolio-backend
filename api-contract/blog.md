# Blog API Contract

Base path: `/api/v1/blog`

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

## GET /

List all **published** blogs. Public endpoint.

**Auth:** none

**Query parameters:**
| Param | Type | Description |
|---|---|---|
| `search` | string | Regex search across `title`, `summary`, `tags` |
| `sortBy` | string | Field to sort by (default: `createdAt`) |
| `sortOrder` | `asc` \| `desc` | Sort direction (default: `asc`) |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `10`) |

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "<objectId>",
      "title": "Getting Started with TypeScript",
      "slug": "getting-started-with-typescript",
      "summary": "A beginner-friendly intro to TypeScript...",
      "content": "# Getting Started\n\n...",
      "coverImage": "https://example.com/cover.jpg",
      "tags": ["typescript", "javascript"],
      "status": "PUBLISHED",
      "views": 142,
      "readTime": 5,
      "metaTitle": "Getting Started with TypeScript | Ranok Raihan",
      "metaDescription": "Learn the basics of TypeScript...",
      "ogImage": "https://example.com/og.jpg",
      "featured": true,
      "publishedAt": "2026-05-17T10:00:00.000Z",
      "createdAt": "2026-05-17T09:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPage": 3
  }
}
```

Note: `addedBy`, `isDeleted`, and `deletedAt` are excluded from the response.

---

## GET /all

List **all** blogs including drafts and archived. Admin/moderator only.

**Auth:** Bearer token required — `admin` or `moderator`

**Query parameters:**
| Param | Type | Description |
|---|---|---|
| `status` | `DRAFT` \| `PUBLISHED` \| `ARCHIVED` | Filter by status |
| `search` | string | Regex search across `title`, `summary` |
| `sortBy` | string | Field to sort by (default: `createdAt`) |
| `sortOrder` | `asc` \| `desc` | Sort direction |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `10`) |

**Response `200`:** Same shape as `GET /` but includes all statuses and all fields.

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token |

---

## GET /:slug

Get a single **published** blog post by slug. Atomically increments the view count. Public endpoint.

**Auth:** none

**Response `200`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "title": "Getting Started with TypeScript",
    "slug": "getting-started-with-typescript",
    "summary": "A beginner-friendly intro to TypeScript...",
    "content": "# Getting Started\n\n...",
    "coverImage": "https://example.com/cover.jpg",
    "tags": ["typescript", "javascript"],
    "status": "PUBLISHED",
    "views": 143,
    "readTime": 5,
    "metaTitle": "Getting Started with TypeScript | Ranok Raihan",
    "metaDescription": "Learn the basics of TypeScript...",
    "ogImage": "https://example.com/og.jpg",
    "featured": true,
    "publishedAt": "2026-05-17T10:00:00.000Z",
    "createdAt": "2026-05-17T09:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

Note: `addedBy`, `isDeleted`, and `deletedAt` are excluded from the response.

**Errors:**
| Status | Condition |
|---|---|
| 404 | Blog not found, not published, or soft-deleted |

---

## POST /

Create a new blog post. Slug is auto-generated from `title` if not provided. Read time is auto-calculated from `content`. `publishedAt` is set automatically when `status` is `PUBLISHED`.

**Auth:** Bearer token required — `admin` or `moderator`

**Request body:**
```json
{
  "title": "Getting Started with TypeScript",
  "slug": "getting-started-with-typescript",
  "summary": "A beginner-friendly intro to TypeScript...",
  "content": "# Getting Started\n\nTypeScript is a typed superset...",
  "coverImage": "https://example.com/cover.jpg",
  "tags": ["typescript", "javascript"],
  "status": "DRAFT",
  "metaTitle": "Getting Started with TypeScript | Ranok Raihan",
  "metaDescription": "Learn the basics of TypeScript...",
  "ogImage": "https://example.com/og.jpg",
  "featured": false
}
```

**Validation:**
- `title` — required, 1–300 characters
- `slug` — optional, lowercase alphanumeric + hyphens, 1–200 characters (auto-generated from title if omitted)
- `summary` — required, 10–500 characters
- `content` — required, minimum 10 characters (Markdown)
- `coverImage` — optional, valid URL
- `tags` — optional, array of strings (each 1–50 chars, max 10 tags)
- `status` — optional, `DRAFT` | `PUBLISHED` | `ARCHIVED` (default: `DRAFT`)
- `metaTitle` — optional, 1–150 characters
- `metaDescription` — optional, 1–300 characters
- `ogImage` — optional, valid URL
- `featured` — optional boolean (default: `false`)

Note: `views`, `readTime`, `publishedAt`, and `addedBy` are server-managed and not accepted in the request body.

**Response `201`:** Full blog document.

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing or invalid token |
| 409 | Duplicate slug (MongoDB unique constraint) |

---

## PATCH /:id

Update a blog post by MongoDB ObjectId. `readTime` is recalculated if `content` is updated. `publishedAt` is set automatically on the first transition to `PUBLISHED`.

**Auth:** Bearer token required — `admin` or `moderator`

**Request body** (all fields optional, at least one required):
```json
{
  "status": "PUBLISHED",
  "featured": true,
  "metaTitle": "Updated SEO title"
}
```

**Validation:** Same field rules as POST, all optional. At least one field must be provided.

Note: `views`, `readTime`, `publishedAt`, and `addedBy` cannot be set via this endpoint.

**Response `200`:** Updated blog document.

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure or no fields provided |
| 401 | Missing or invalid token |
| 404 | Blog not found or soft-deleted |

---

## DELETE /:id

Soft-delete a blog post by MongoDB ObjectId. Sets `isDeleted: true` and records `deletedAt`. The post is immediately hidden from all public endpoints.

**Auth:** Bearer token required — `admin` or `moderator`

**Response `200`:**
```json
{
  "data": { "_id": "<objectId>", "title": "Getting Started with TypeScript" }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token |
| 404 | Blog not found or already soft-deleted |
