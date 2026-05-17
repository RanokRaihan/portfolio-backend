# Testimonial API Contract

Base path: `/api/v1/testimonial`

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

Create a new testimonial.

**Auth:** Bearer token required — `admin` or `moderator`

**Request body:**
```json
{
  "name": "Jane Smith",
  "role": "Senior Engineer at Google",
  "company": "Google",
  "avatar": "https://example.com/avatar.jpg",
  "linkedIn": "https://linkedin.com/in/janesmith",
  "quote": "Working with Ranok was an exceptional experience...",
  "relation": "PEER",
  "featured": true,
  "sortOrder": 1
}
```

**Validation:**
- `name` — required, 1–100 characters
- `role` — required, 1–150 characters
- `company` — optional, 1–150 characters
- `avatar` — optional, valid URL
- `linkedIn` — optional, valid URL
- `quote` — required, 10–1000 characters
- `relation` — required, one of: `MENTOR`, `PEER`, `CLIENT`, `INSTRUCTOR`, `OTHER`
- `featured` — optional boolean (default `false`)
- `sortOrder` — optional non-negative integer (default `0`)

**Response `201`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "addedBy": "<userId>",
    "name": "Jane Smith",
    "role": "Senior Engineer at Google",
    "company": "Google",
    "avatar": "https://example.com/avatar.jpg",
    "linkedIn": "https://linkedin.com/in/janesmith",
    "quote": "Working with Ranok was an exceptional experience...",
    "relation": "PEER",
    "featured": true,
    "sortOrder": 1,
    "isDeleted": false,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing or invalid token |

---

## GET /

List all testimonials (non-deleted). Public endpoint.

**Auth:** none

**Query parameters:**
| Param | Type | Description |
|---|---|---|
| `featured` | `true` \| `false` | Filter by featured status |
| `relation` | `MENTOR` \| `PEER` \| `CLIENT` \| `INSTRUCTOR` \| `OTHER` | Filter by relation type |
| `search` | string | Regex search across `name`, `company`, `quote` |
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
      "name": "Jane Smith",
      "role": "Senior Engineer at Google",
      "company": "Google",
      "avatar": "https://example.com/avatar.jpg",
      "linkedIn": "https://linkedin.com/in/janesmith",
      "quote": "Working with Ranok was an exceptional experience...",
      "relation": "PEER",
      "featured": true,
      "sortOrder": 1,
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPage": 1
  }
}
```

Note: `addedBy` and `isDeleted` are excluded from the response.

---

## GET /:id

Get a single testimonial by ID. Public endpoint.

**Auth:** none

**Response `200`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "name": "Jane Smith",
    "role": "Senior Engineer at Google",
    "company": "Google",
    "avatar": "https://example.com/avatar.jpg",
    "linkedIn": "https://linkedin.com/in/janesmith",
    "quote": "Working with Ranok was an exceptional experience...",
    "relation": "PEER",
    "featured": true,
    "sortOrder": 1,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

Note: `addedBy` and `isDeleted` are excluded from the response.

**Errors:**
| Status | Condition |
|---|---|
| 404 | Testimonial not found or soft-deleted |

---

## PATCH /:id

Update a testimonial.

**Auth:** Bearer token required — `admin` or `moderator`

**Request body** (all fields optional, at least one required):
```json
{
  "quote": "Updated testimonial text...",
  "featured": false,
  "sortOrder": 2
}
```

**Validation:** Same field rules as POST, all optional. At least one field must be provided.

**Response `200`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "name": "Jane Smith",
    "role": "Senior Engineer at Google",
    "quote": "Updated testimonial text...",
    "featured": false,
    "sortOrder": 2,
    "updatedAt": "2026-05-17T10:10:00.000Z"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure or no fields provided |
| 401 | Missing or invalid token |
| 404 | Testimonial not found or soft-deleted |

---

## DELETE /:id

Soft-delete a testimonial (sets `isDeleted: true`). The record is retained in the database.

**Auth:** Bearer token required — `admin` or `moderator`

**Response `200`:**
```json
{
  "data": { "_id": "<objectId>", "name": "Jane Smith" }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token |
| 404 | Testimonial not found or already soft-deleted |
