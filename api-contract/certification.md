# Certification API Contract

Base path: `/api/v1/certification`

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

Add a new certification record.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
POST /api/v1/certification
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "name": "AWS Certified Developer – Associate",
  "issuer": "Amazon Web Services",
  "issuedAt": "2024-03-15",

  // Optional
  "issuerLogoUrl": "https://cdn.example.com/logos/aws.png",
  "credentialId": "ABC123XYZ",
  "credentialUrl": "https://aws.amazon.com/verify/ABC123XYZ",
  "certificateUrl": "https://cdn.example.com/certs/aws-dev.pdf",
  "badgeUrl": "https://cdn.example.com/badges/aws-dev.png",
  "isExpired": false,
  "isLifetime": false,
  "expiresAt": "2027-03-15",
  "courseStartDate": "2024-01-01",
  "courseEndDate": "2024-03-01",
  "featured": true,
  "sortOrder": 1
}
```

### Required fields

| Field       | Type   | Notes                        |
|-------------|--------|------------------------------|
| `name`      | string | 1–200 chars                  |
| `issuer`    | string | 1–150 chars                  |
| `issuedAt`  | date   | ISO 8601 string or timestamp |

### Optional fields

| Field             | Type    | Notes                                                                        |
|-------------------|---------|------------------------------------------------------------------------------|
| `issuerLogoUrl`   | string  | Must be a valid URL                                                          |
| `credentialId`    | string  | Max 200 chars                                                                |
| `credentialUrl`   | string  | Must be a valid URL                                                          |
| `certificateUrl`  | string  | Must be a valid URL                                                          |
| `badgeUrl`        | string  | Must be a valid URL                                                          |
| `isExpired`       | boolean | Default `false`                                                              |
| `isLifetime`      | boolean | Default `true`. When `false`, `expiresAt` is required.                       |
| `expiresAt`       | date    | ISO 8601. Required when `isLifetime` is `false`. Must be after `issuedAt`.   |
| `courseStartDate` | date    | ISO 8601. When the course started.                                           |
| `courseEndDate`   | date    | ISO 8601. Must be on or after `courseStartDate`.                             |
| `featured`        | boolean | Default `false`                                                              |
| `sortOrder`       | number  | Non-negative integer, default `0`                                            |

### Business rules

- `isLifetime: true` and `expiresAt` cannot both be set.
- `isLifetime: false` requires `expiresAt`.
- `expiresAt` must be after `issuedAt`.
- `courseEndDate` must be on or after `courseStartDate`.

### Responses

**201 Created**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Certification created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "addedBy": "665f0000000000000000000a",
    "name": "AWS Certified Developer – Associate",
    "issuer": "Amazon Web Services",
    "issuerLogoUrl": "https://cdn.example.com/logos/aws.png",
    "credentialId": "ABC123XYZ",
    "credentialUrl": "https://aws.amazon.com/verify/ABC123XYZ",
    "certificateUrl": "https://cdn.example.com/certs/aws-dev.pdf",
    "badgeUrl": "https://cdn.example.com/badges/aws-dev.png",
    "isExpired": false,
    "isLifetime": false,
    "issuedAt": "2024-03-15T00:00:00.000Z",
    "expiresAt": "2027-03-15T00:00:00.000Z",
    "courseStartDate": "2024-01-01T00:00:00.000Z",
    "courseEndDate": "2024-03-01T00:00:00.000Z",
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
    { "path": "body.expiresAt", "message": "expiresAt is required when isLifetime is false" }
  ]
}
```

**400 Bad Request** — `isLifetime` and `expiresAt` conflict
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot set expiresAt when isLifetime is true"
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

## GET /:id

Get a single certification record by MongoDB ID. No authentication required.

Soft-deleted records are excluded. `addedBy`, `isDeleted`, and `deletedAt` are excluded from the response.

### Request

```http
GET /api/v1/certification/:id
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Certification retrieved successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "AWS Certified Developer – Associate",
    "issuer": "Amazon Web Services",
    "issuerLogoUrl": "https://cdn.example.com/logos/aws.png",
    "credentialId": "ABC123XYZ",
    "credentialUrl": "https://aws.amazon.com/verify/ABC123XYZ",
    "certificateUrl": "https://cdn.example.com/certs/aws-dev.pdf",
    "badgeUrl": "https://cdn.example.com/badges/aws-dev.png",
    "isExpired": false,
    "isLifetime": false,
    "issuedAt": "2024-03-15T00:00:00.000Z",
    "expiresAt": "2027-03-15T00:00:00.000Z",
    "courseStartDate": "2024-01-01T00:00:00.000Z",
    "courseEndDate": "2024-03-01T00:00:00.000Z",
    "featured": true,
    "sortOrder": 1,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

**404 Not Found** — record does not exist or is soft-deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Certification not found"
}
```

---

## PATCH /:id

Update a certification record by MongoDB ID.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
PATCH /api/v1/certification/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

All fields are optional. At least one must be provided. Unknown keys are rejected. If `isLifetime` is set to `true`, any existing `expiresAt` on the document is automatically unset.

```json
{
  "isExpired": true,
  "featured": false
}
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Certification updated successfully",
  "data": { "...full updated certification document..." }
}
```

**400 Bad Request** — empty body, validation failure, or conflicting `isLifetime`/`expiresAt`

**401 Unauthorized** — missing or invalid token  
**403 Forbidden** — insufficient role

**404 Not Found** — record does not exist or is already deleted
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Certification not found"
}
```

---

## DELETE /:id

Soft-delete a certification record by MongoDB ID. Sets `isDeleted: true` and records `deletedAt`; the record remains in the database.

**Auth:** Bearer token required. Roles: `admin`, `moderator`.

### Request

```http
DELETE /api/v1/certification/:id
Authorization: Bearer <access_token>
```

### Responses

**200 OK**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Certification deleted successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "AWS Certified Developer – Associate"
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
  "message": "Certification not found"
}
```

---

## GET /

Get all certification records. No authentication required.

Soft-deleted records (`isDeleted: true`) are excluded. Results are sorted by `sortOrder` ascending, then `issuedAt` descending. `addedBy`, `isDeleted`, and `deletedAt` are excluded from each document.

### Response — 200 OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Certifications retrieved successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "AWS Certified Developer – Associate",
      "issuer": "Amazon Web Services",
      "issuerLogoUrl": "https://cdn.example.com/logos/aws.png",
      "credentialId": "ABC123XYZ",
      "credentialUrl": "https://aws.amazon.com/verify/ABC123XYZ",
      "certificateUrl": "https://cdn.example.com/certs/aws-dev.pdf",
      "badgeUrl": "https://cdn.example.com/badges/aws-dev.png",
      "isExpired": false,
      "isLifetime": false,
      "issuedAt": "2024-03-15T00:00:00.000Z",
      "expiresAt": "2027-03-15T00:00:00.000Z",
      "courseStartDate": "2024-01-01T00:00:00.000Z",
      "courseEndDate": "2024-03-01T00:00:00.000Z",
      "featured": true,
      "sortOrder": 1,
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```
