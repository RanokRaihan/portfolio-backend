# Message API Contract

Base path: `/api/v1/message`

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

Submit a contact message. Sends an email notification to the portfolio owner.

**Auth:** none

**Rate limit:** 5 requests per 10 minutes per IP → `429` when exceeded.

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Collaboration opportunity",
  "message": "Hi, I'd love to work with you on..."
}
```

**Validation:**
- `name` — required, 1–100 characters
- `email` — required, valid email format
- `subject` — optional, 1–200 characters
- `message` — required, 10–2000 characters

**Response `201`:**
```json
{
  "data": { "_id": "<objectId>" }
}
```

Note: `ipAddress` and `userAgent` are captured server-side and stored in the database but never returned to the caller.

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure |
| 429 | Rate limit exceeded |

---

## GET /

List all messages with optional filtering, search, sorting, and pagination.

**Auth:** Bearer token required — `admin` or `moderator`

**Query parameters:**
| Param | Type | Description |
|---|---|---|
| `status` | `UNREAD` \| `READ` \| `REPLIED` \| `ARCHIVED` | Filter by status |
| `search` | string | Regex search across `name`, `email`, `subject` |
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
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Collaboration opportunity",
      "message": "Hi, I'd love to work with you on...",
      "status": "UNREAD",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0 ...",
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
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

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token |

---

## GET /:id

Get a single message by ID. Automatically transitions status from `UNREAD` to `READ`.

**Auth:** Bearer token required — `admin` or `moderator`

**Response `200`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Collaboration opportunity",
    "message": "Hi, I'd love to work with you on...",
    "status": "READ",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0 ...",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:01:00.000Z"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token |
| 404 | Message not found |

---

## PATCH /:id/status

Update the status of a message.

**Auth:** Bearer token required — `admin` or `moderator`

**Request body:**
```json
{
  "status": "REPLIED"
}
```

**Validation:**
- `status` — required, one of: `UNREAD`, `READ`, `REPLIED`, `ARCHIVED`

**Response `200`:**
```json
{
  "data": {
    "_id": "<objectId>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Collaboration opportunity",
    "message": "Hi, I'd love to work with you on...",
    "status": "REPLIED",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:05:00.000Z"
  }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 400 | Validation failure |
| 401 | Missing or invalid token |
| 404 | Message not found |

---

## DELETE /:id

Permanently delete a message.

**Auth:** Bearer token required — `admin` only (moderators receive `401`)

**Response `200`:**
```json
{
  "data": { "_id": "<objectId>" }
}
```

**Errors:**
| Status | Condition |
|---|---|
| 401 | Missing or invalid token, or role is not `admin` |
| 404 | Message not found |
