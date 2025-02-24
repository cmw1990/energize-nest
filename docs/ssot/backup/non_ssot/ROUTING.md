# Routing Architecture

## Overview
Well-Charged is a pan-platform application that serves both web and mobile users through a unified web-based codebase. This document outlines our routing strategy, layout patterns, and navigation structure.

## Core Principles
1. **Platform Agnostic Routes**: All routes are web-first but designed to work seamlessly on mobile
2. **Authentication Aware**: Clear separation between public and authenticated routes
3. **Semantic URLs**: URLs reflect the logical hierarchy of features
4. **Consistent Patterns**: Predictable route naming and nesting conventions

## Route Structure

### Public Routes
```
/                   # Landing page
├── tools/          # Public tools (no auth required)
│   ├── calculator/ # Energy calculator
│   ├── planner/    # Daily planner
│   └── assessment/ # Health assessment
└── auth/          # Authentication pages
    ├── login
    └── register
```

### Protected Routes
```
/dashboard         # Main dashboard
├── energy/       # Energy management
│   ├── plans     # Energy planning
│   ├── tracking  # Energy tracking
│   └── analytics # Energy analytics
├── health/       # Health monitoring
│   ├── mental    # Mental health
│   │   ├── anxiety
│   │   └── ocd
│   ├── sleep     # Sleep tracking
│   └── exercise  # Exercise tracking
├── social/       # Social features
│   ├── community # Community forums
│   └── experts   # Expert consultation
└── settings/     # User settings
```

## Layout Strategy

### Web Layouts
1. **Public Layout**: 
   - Full-width header
   - Centered content
   - Footer with links

2. **Dashboard Layout**:
   - Sidebar navigation
   - Top header with user menu
   - Main content area

### Mobile Layouts
1. **Public Layout**:
   - Stack navigation
   - Bottom tab bar
   - Full-screen content

2. **Dashboard Layout**:
   - Bottom navigation
   - Swipeable content
   - Pull-to-refresh

## Navigation Patterns

### Web Navigation
- Sidebar for main navigation
- Breadcrumbs for hierarchy
- Dropdown menus for sub-features

### Mobile Navigation
- Bottom tabs for primary navigation
- Stack navigation for feature depth
- Back button for navigation history

## Route Guards

### Authentication Guards
- Public routes: No authentication required
- Protected routes: Requires valid session
- Admin routes: Requires admin privileges

### Platform Guards
- Mobile-only features
- Web-only features
- Platform-specific layouts

## URL Parameters

### Standard Parameters
- `?view`: Display mode (grid/list)
- `?period`: Time period (day/week/month)
- `?filter`: Data filters

### State Parameters
- `?tab`: Active tab
- `?modal`: Modal to display
- `?step`: Wizard step

## Development Guidelines

### Adding New Routes
1. Define route in `router.tsx`
2. Create corresponding page component
3. Add to navigation configuration
4. Update documentation

### Route Naming Conventions
- Use kebab-case for URLs
- Use PascalCase for components
- Prefix protected routes with auth guard

### Code Organization
```
src/
├── pages/         # Page components
├── layouts/       # Layout components
├── navigation/    # Navigation config
└── router/        # Router configuration
```

## Testing Routes

### Unit Tests
- Test route guards
- Test navigation logic
- Test URL parameters

### Integration Tests
- Test navigation flows
- Test layout switching
- Test platform detection

## Performance Considerations

### Code Splitting
- Route-based splitting
- Component lazy loading
- Preload critical routes

### Caching Strategy
- Cache route data
- Cache layout components
- Cache navigation state

## Monitoring

### Analytics
- Page views
- Navigation patterns
- Error rates

### Error Tracking
- 404 errors
- Authentication failures
- Navigation timing
