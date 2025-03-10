# API Documentation

## Overview
Well-Charged uses Supabase for backend services. This document outlines all API endpoints, their purposes, and usage patterns.

## Authentication
All protected endpoints require a valid JWT token in the Authorization header.

## Base URL
```
https://zoubqdwxemivxrjruvam.supabase.co
```

## Endpoints

### User Management
```typescript
POST /auth/v1/signup
POST /auth/v1/login
POST /auth/v1/logout
GET  /auth/v1/user
```

### Energy Management
```typescript
GET    /rest/v1/energy_levels
POST   /rest/v1/energy_levels
GET    /rest/v1/energy_plans
POST   /rest/v1/energy_plans
PATCH  /rest/v1/energy_plans
DELETE /rest/v1/energy_plans
```

### Health Tracking
```typescript
GET    /rest/v1/sleep_records
POST   /rest/v1/sleep_records
GET    /rest/v1/exercise_records
POST   /rest/v1/exercise_records
GET    /rest/v1/mental_health_records
POST   /rest/v1/mental_health_records
```

### Analytics
```typescript
GET    /rest/v1/analytics/energy
GET    /rest/v1/analytics/sleep
GET    /rest/v1/analytics/exercise
GET    /rest/v1/analytics/mental_health
```

## Database Schema

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### energy_levels
```sql
CREATE TABLE energy_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  level INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  notes TEXT
);
```

### sleep_records
```sql
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  quality_score INTEGER,
  notes TEXT
);
```

## Error Handling

### Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

### Error Response Format
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Burst: 200 requests

## Security

### Authentication
- JWT-based authentication
- Tokens expire after 1 hour
- Refresh tokens valid for 7 days

### Data Protection
- All data encrypted at rest
- All transmissions over HTTPS
- Regular security audits

## Best Practices

### Request Format
```typescript
// POST request
{
  "data": {
    // request data
  },
  "metadata": {
    "client_version": string,
    "platform": string
  }
}
```

### Response Format
```typescript
{
  "data": {
    // response data
  },
  "metadata": {
    "timestamp": string,
    "request_id": string
  }
}
```

## Versioning
- API version in URL path
- Current version: v1
- Deprecation notice: 6 months
- End-of-life: 12 months

## Monitoring
- Request latency
- Error rates
- Usage patterns
- Performance metrics
