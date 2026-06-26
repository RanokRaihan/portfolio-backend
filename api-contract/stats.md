# Stats API Contract

## GET /api/v1/stats

Returns aggregated counts and breakdowns across all portfolio modules for the admin dashboard.

**Auth:** Required — `admin` role only.

### Response `200`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Stats retrieved successfully",
  "data": {
    "projects": {
      "total": 10,
      "byStatus": {
        "PUBLISHED": 5,
        "DRAFT": 3,
        "ARCHIVED": 1,
        "IN_PROGRESS": 1
      },
      "featured": 3,
      "byCategory": {
        "FULL_STACK": 4,
        "FRONTEND": 3,
        "BACKEND": 3
      }
    },
    "blogs": {
      "total": 8,
      "byStatus": {
        "PUBLISHED": 5,
        "DRAFT": 2,
        "ARCHIVED": 1
      },
      "totalViews": 1250,
      "featured": 2
    },
    "messages": {
      "total": 25,
      "unread": 5,
      "byStatus": {
        "UNREAD": 5,
        "READ": 10,
        "REPLIED": 8,
        "ARCHIVED": 2
      }
    },
    "skills": {
      "total": 30,
      "featured": 8,
      "byCategory": {
        "FRONTEND": 10,
        "BACKEND": 8,
        "DATABASE": 4,
        "DEVOPS": 4,
        "TOOL": 4
      },
      "byLevel": {
        "EXPERT": 5,
        "ADVANCED": 10,
        "PROFICIENT": 10,
        "FAMILIAR": 5
      }
    },
    "certifications": {
      "total": 12,
      "active": 8,
      "expired": 2,
      "lifetime": 2,
      "featured": 4
    },
    "education": {
      "total": 3,
      "current": 1,
      "completed": 2,
      "featured": 2
    },
    "testimonials": {
      "total": 10,
      "featured": 3,
      "byRelation": {
        "CLIENT": 4,
        "MENTOR": 2,
        "PEER": 3,
        "INSTRUCTOR": 1
      }
    }
  }
}
```

### Errors

| Status | Condition |
|--------|-----------|
| `401`  | No token / invalid token |
| `403`  | Authenticated but not `admin` role |
