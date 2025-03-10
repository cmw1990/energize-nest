# Authentication

## Overview
This document outlines the authentication framework, user account management, and access control for the Well-Charged platform.

## Authentication Flow

1. User signs up or logs in through the `/auth` page
2. Authentication is handled through Supabase Auth
3. JWT tokens are issued upon successful authentication
4. The application checks for an active session before connecting to the database
5. Database operations use Row Level Security (RLS) to enforce access control

## Account Types

### Regular User Accounts
- Created through standard signup process
- Email verification required
- Personal data stored securely in user-specific tables

### Development Test Account
- Email: superwellcharged@gmail.com
- Used for development and testing purposes only
- Keep test data isolated from production

### Demo User Account
- Email: hertzofhopes@gmail.com
- Password: J4913836j
- Used for all demos and presentations
- Contains real data stored in this user's actual data tables
- NEVER use frontend mock data when presenting with this account

## Authentication Implementation

```typescript
// src/components/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/client';
import { Session, User } from '@supabase/supabase-js';

// Authentication code reference
const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error checking session:', error);
    return null;
  }
  return data.session;
};
```

## Security Guidelines

1. **Session Management**
   - JWT tokens expire after 1 hour
   - Refresh tokens handled automatically
   - Sessions invalidated on security events

2. **Password Security**
   - Strong password requirements enforced
   - Passwords hashed securely by Supabase
   - Password reset flow available

3. **Access Control**
   - Row Level Security (RLS) enforced at database level
   - User-specific data access controls
   - Role-based permissions for admin features

4. **Authentication UX**
   - Clear error messages for authentication issues
   - Smooth onboarding flow
   - Password reset and account recovery

## Related Documentation
- [Database Security](./technical/SECURITY.md)
- [Supabase Integration](./technical/SUPABASE.md)
- [User Onboarding](./features/USER_ONBOARDING.md) 