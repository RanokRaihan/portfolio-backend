# Education API Contract

Base path: `/api/v1/education`

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

Add a new education record.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
POST /api/v1/education
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "institution": "University of Dhaka",
  "startDate": "2019-01-01",

  // Optional
  "degree": "Bachelor of Science",
  "field": "Computer Science",
  "description": "Graduated with distinction.",
  "logoUrl": "https://cdn.example.com/logos/du.png",
  "location": "Dhaka, Bangladesh",
  "isCurrent": false,
  "endDate": "2023-01-01",
  "featured": true,
  "sortOrder": 1
}
```

### Required fields

| Field         | Type   | Notes                        |
|---------------|--------|------------------------------|
| `institution` | string | 1–120 chars                  |
| `startDate`   | date   | ISO 8601 string or timestamp |

### Optional fields

| Field         | Type    | Notes                                                               |
|---------------|---------|---------------------------------------------------------------------|
| `degree`      | string  | 1–100 chars                                                         |
| `field`       | string  | 1–100 chars                                                         |
| `description` | string  | Max 1000 chars                                                      |
| `logoUrl`     | string  | Must be a valid URL                                                 |
| `location`    | string  | Max 100 chars                                                       |
| `isCurrent`   | boolean | Default `false`. Cannot be combined with `endDate`.                 |
| `endDate`     | date    | ISO 8601. Must be after `startDate`. Omit when `isCurrent` is true. |
| `featured`    | boolean | Default `false`                                                     |
| `sortOrder`   | number  | Non-negative integer, default `0`                                   |

### Responses

**201 Created**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Education record created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "addedBy": "665f0000000000000000000a",
    "institution": "University of Dhaka",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "description": "Graduated with distinction.",
    "logoUrl": "https://cdn.example.com/logos/du.png",
    "location": "Dhaka, Bangladesh",
    "isCurrent": false,
    "startDate": "2019-01-01T00:00:00.000Z",
    "endDate": "2023-01-01T00:00:00.000Z",
    "featured": true,
    "sortOrder": 1,
    "isDeleted": false,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**400 Bad Request** — validation failure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorDetails": [
    { "path": "body.endDate", "message": "End date must be after start date" }
  ]
}
```

**400 Bad Request** — `isCurrent` and `endDate` both provided
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot set end date when isCurrent is true"
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

---

## PATCH /:id

Update an education record by MongoDB ID.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
PATCH /api/v1/education/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

All fields are optional. At least one must be provided. Unknown keys are rejected. If `isCurrent` is set to `true`, any existing `endDate` on the document is automatically unset.

```json
{
  "isCurrent": true,
  "description": "Updated description."
}
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Education record updated successfully",
  "data": { "...full updated education document..." }
}
```

**400 Bad Request** — empty body, validation failure, or conflicting `isCurrent`/`endDate`

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — record does not exist or is already deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Education record not found"
}
```

---

## DELETE /:id

Soft-delete an education record by MongoDB ID. Sets `isDeleted: true`; the record remains in the database.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
DELETE /api/v1/education/:id
Authorization: Bearer <access_token>
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Education record deleted successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "institution": "University of Dhaka"
  }
}
```

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — record does not exist or is already deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Education record not found"
}
```

---

## GET /

Get all education records. No authentication required.

Soft-deleted records (`isDeleted: true`) are excluded. Results are sorted by `sortOrder` ascending, then `startDate` descending. `addedBy` and `isDeleted` are excluded from each document.

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Education records retrieved successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "institution": "University of Dhaka",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "description": "Graduated with distinction.",
      "logoUrl": "https://cdn.example.com/logos/du.png",
      "location": "Dhaka, Bangladesh",
      "isCurrent": false,
      "startDate": "2019-01-01T00:00:00.000Z",
      "endDate": "2023-01-01T00:00:00.000Z",
      "featured": true,
      "sortOrder": 1,
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```
