# Routing Strategy (SSOT)

## Overview
This document defines the routing strategy and naming conventions across all platforms in the Well-Charged ecosystem.

## Platform Route Categories

### Default Routes (No Tag)
- **Purpose**: Web pages, function routes, pan-platform routes
- **When to Use**: 
  - Landing pages
  - Web tools
  - Function routes (e.g., auth)
  - Pan-platform features
- **Naming Convention**: No special prefix/tag
- **Examples**:
  ```typescript
  // Landing page
  '/'
  // Web tools
  '/tools/energy-calculator'
  // Function routes
  '/auth/login'
  ```

### WebApp Routes
- **Tag**: `webapp`
- **Purpose**: Web application specific features
- **When to Use**: When explicitly developing webapp features
- **Naming Convention**: Prefix with `/webapp`
- **Examples**:
  ```typescript
  '/webapp/dashboard'
  '/webapp/settings'
  '/webapp/analytics'
  ```

### Mobile App Routes
- **Tag**: `mobileapp`
- **Purpose**: Mobile application specific features
- **When to Use**: When explicitly developing mobile app features
- **Naming Convention**: Prefix with `/mobileapp`
- **Examples**:
  ```typescript
  '/mobileapp/dashboard'
  '/mobileapp/quick-track'
  ```

### PC App Routes
- **Tag**: `pcapp`
- **Purpose**: Desktop application specific features
- **When to Use**: When explicitly developing desktop features
- **Naming Convention**: Prefix with `/pcapp`
- **Examples**:
  ```typescript
  '/pcapp/system-monitor'
  '/pcapp/screen-track'
  ```

### Extension Routes
- **Tag**: `ext`
- **Purpose**: Chrome extension specific features
- **When to Use**: When explicitly developing extension features
- **Naming Convention**: Prefix with `/ext`
- **Examples**:
  ```typescript
  '/ext/quick-timer'
  '/ext/mini-dash'
  ```

### CMS Tools Routes

The CMS tools are accessible under the `/tools/cms/*` path namespace. Each CMS tool has its own dedicated route:

- `/tools/cms` - CMS tools landing page and overview
- `/tools/cms/builder` - Builder.io CMS testing environment
- `/tools/cms/sanity` - Sanity CMS testing environment
- `/tools/cms/tina` - TinaCMS testing environment
- `/tools/cms/payload` - Payload CMS testing environment
- `/tools/cms/decap` - Decap CMS testing environment
- `/tools/cms/storyblok` - Storyblok CMS testing environment
- `/tools/cms/keystone` - Keystone CMS testing environment

### Redirects
- Root (`/`): Redirects to `/tools/cms`
- Admin (`/admin/*`): Redirects to `/tools/cms/decap`

### Route Implementation Details

1. All CMS routes are mounted under the `/tools` namespace to maintain separation from core application routes
2. Each CMS tool is implemented as a standalone route to prevent nesting conflicts
3. The CMS landing page serves as the entry point and navigation hub
4. Individual CMS routes load their respective testing environments

### Route Access Control

- CMS tools are accessible in development mode only
- No authentication required for CMS testing routes
- Changes made in CMS tools are isolated from production data

### Cross-References

- See `PLATFORM_FEATURES.md` for CMS tool capabilities
- See `DEVELOPMENT_STATUS.md` for CMS integration status
- See `SECURITY.md` for CMS testing environment security considerations

## Route Configuration

The application's routes are defined in `src/routes.tsx` using React Router's `RouteObject` type. This is the single source of truth for all application routes.

### Key Route Files

1. `src/routes.tsx` - Main route definitions with React components
2. `src/App.tsx` - Route setup and configuration
3. `src/layouts/*` - Layout components for different platforms

### Route Structure

```typescript
routes: RouteObject[] = [
  {
    path: '/',              // Landing page
    element: <LandingPage />
  },
  {
    path: '/auth/*',        // Authentication routes
    element: <Auth />
  },
  {
    path: '/tools',         // Tools section with AppLayout
    element: <AppLayout />,
    children: [
      {
        path: 'cms',        // CMS tools
        element: <CMSLanding />
      },
      // Other tool routes...
    ]
  },
  {
    path: '/webapp',        // Web application routes
    element: <WebAppLayout />,
    children: [
      // Web app specific routes...
    ]
  }
]
```

### Route Organization

1. Root Level Routes (`/`)
   - Landing page
   - Authentication

2. Tools Section (`/tools/*`)
   - CMS tools
   - Energy calculator
   - Focus timer

3. Web Application (`/webapp/*`)
   - Dashboard
   - Analytics

## Navigation Flow

### Entry Points
1. **Landing Page (Default)**
   - Route: `/`
   - Purpose: Main entry point
   - Navigation Options:
     - WebApp
     - Web Tools
     - Documentation

2. **Platform-Specific Entry**
   ```typescript
   // WebApp entry
   '/webapp'
   // Mobile App entry
   '/mobileapp'
   // PC App entry
   '/pcapp'
   // Extension entry
   '/ext'
   ```

### Common Navigation Patterns

1. **Default to Platform-Specific**
   ```typescript
   / -> /webapp/dashboard
   / -> /tools/calculator
   ```

2. **Cross-Platform Navigation**
   ```typescript
   /webapp/settings -> /webapp/profile
   /mobileapp/quick-track -> /mobileapp/history
   ```

3. **Function Routes**
   ```typescript
   /auth/login -> /auth/verify
   /auth/register -> /auth/verify
   ```

## Implementation Guidelines

### Route Definition
```typescript
// Default routes (no tag)
{
  path: '/',
  element: <LandingPage />
},
{
  path: '/tools/*',
  element: <WebTools />
},

// Platform-specific routes
{
  path: '/webapp/*',
  element: <WebAppLayout />
},
{
  path: '/mobileapp/*',
  element: <MobileAppLayout />
},
{
  path: '/pcapp/*',
  element: <PCAppLayout />
},
{
  path: '/ext/*',
  element: <ExtensionLayout />
}
```

### Layout Structure
1. **Default Layout**
   - Header with navigation
   - Content area
   - Footer

2. **WebApp Layout**
   - Dashboard header
   - Sidebar navigation
   - Content area
   - Action footer

3. **Mobile Layout**
   - Mobile header
   - Bottom navigation
   - Content area

4. **PC Layout**
   - System menu bar
   - Multi-window support
   - Content area
   - Status bar

5. **Extension Layout**
   - Compact header
   - Content area
   - Quick actions

## Error Minimization Strategy

1. **Default Route Policy**
   - No special tags for web pages
   - No special tags for function routes
   - No special tags for pan-platform features
   - Reason: Minimize tagging errors

2. **Platform-Specific Route Policy**
   - Only add platform tags when explicitly specified
   - Always use full platform name in tags
   - Validate route category during development

3. **Route Validation**
   ```typescript
   const validateRoute = (path: string, type?: 'webapp' | 'mobileapp' | 'pcapp' | 'ext') => {
     if (!type) return true; // Default routes need no validation
     return path.startsWith(`/${type}`);
   };
   ```

## Route Update Process

1. **Pre-Update Checklist**
   - Verify platform category
   - Check naming convention
   - Validate layout requirements
   - Review navigation flow

2. **Update Steps**
   - Add route definition
   - Implement layouts
   - Update navigation
   - Test cross-platform

3. **Post-Update Verification**
   - Validate route naming
   - Test navigation flow
   - Verify layouts
   - Cross-platform testing
