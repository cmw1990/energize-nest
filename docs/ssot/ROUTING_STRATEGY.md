# Pan-Platform Routing Strategy

## Platform Categories

We divide our application into distinct platform categories:

1. **Marketing Platform** (`/`)
   - Homepage
   - Landing pages
   - Public content
   
2. **Web Platform** (`web/`)
   - Public marketing pages
   - Web-only tools
   - Documentation
   
3. **Application Platform** (`app/`)
   - Core application features
   - Dashboard
   - Tools and utilities
   
4. **Mobile Platform** (`mobile/`)
   - Mobile-optimized views
   - Native features
   - Touch-optimized interfaces

5. **Desktop Platform** (`desktop/`)
   - PC app specific features
   - System integration
   - Native desktop capabilities

6. **Extension Platform** (`ext/`)
   - Chrome extension features
   - Browser integration
   - Quick actions

## Route Naming Convention

### 1. Platform Prefix
```typescript
// Platform identifiers in routes
/           // Root/marketing routes
web/        // Web-specific routes
app/        // Application routes
mobile/     // Mobile-specific routes
desktop/    // Desktop app routes
ext/        // Extension routes
shared/     // Cross-platform routes
```

### 2. Feature Paths
```typescript
[platform]/[feature]/[subfeature]

Examples:
/landing/promo-spring-2025    // Marketing landing
web/tools/calculator
app/dashboard/energy
mobile/tracking/sleep
desktop/system/notifications
ext/quick-track/timer
```

### 3. Route Structure Matrix

| Route Pattern | Web | WebApp | Mobile | Desktop | Extension | Description |
|--------------|-----|--------|---------|---------|-----------|-------------|
| `/`          | ✅   | ❌      | ❌       | ❌        | ❌         | Main homepage |
| `/landing/*` | ✅   | ❌      | ❌       | ❌        | ❌         | Marketing pages |
| `web/*`      | ✅   | ❌      | ❌       | ❌        | ❌         | Web-only features |
| `app/*`      | ✅   | ✅      | ❌       | ✅        | ❌         | WebApp features |
| `mobile/*`   | ❌   | ❌      | ✅       | ❌        | ❌         | Mobile-only features |
| `desktop/*`  | ❌   | ❌      | ❌       | ✅        | ❌         | Desktop-only features |
| `ext/*`      | ❌   | ❌      | ❌       | ❌        | ✅         | Extension-only features |
| `shared/*`   | ✅   | ✅      | ✅       | ✅        | ✅         | Cross-platform features |

## Detailed Route Specifications

### Marketing Platform Routes (`/`)
```typescript
// Marketing and Landing Pages
/
├── landing/               # Landing pages
│   ├── main              # Main homepage
│   ├── features          # Features showcase
│   └── pricing           # Pricing page
├── about/                # About pages
│   ├── company
│   ├── team
│   └── contact
└── blog/                 # Blog and updates
    ├── articles
    └── news
```

### Web Platform Routes (`web/`)
```typescript
// Marketing and Public Pages
web/
├── landing/               # Marketing landing page
├── about/                # About pages
│   ├── company
│   ├── team
│   └── contact
├── tools/                # Web-based tools
│   ├── calculator
│   ├── planner
│   └── assessment
└── docs/                 # Documentation pages
    ├── guides
    ├── api
    └── help
```

### Application Platform Routes (`app/`)
```typescript
// Core Application Features
app/
├── dashboard/            # Main dashboard
│   ├── overview
│   ├── widgets
│   └── settings
├── energy/              # Energy management
│   ├── tracking
│   ├── analysis
│   └── planning
├── health/              # Health features
│   ├── mental
│   ├── physical
│   └── sleep
└── social/             # Social features
    ├── community
    ├── messaging
    └── sharing
```

### Mobile Platform Routes (`mobile/`)
```typescript
// Mobile-Specific Features
mobile/
├── quick-actions/       # Mobile quick actions
│   ├── track
│   ├── log
│   └── share
├── offline/            # Offline capabilities
│   ├── sync
│   └── cache
└── native/            # Native features
    ├── notifications
    ├── sensors
    └── camera
```

### Desktop Platform Routes (`desktop/`)
```typescript
// Desktop-Specific Features
desktop/
├── system/              # System integration
│   ├── notifications    # System notifications
│   ├── tray            # System tray features
│   └── shortcuts       # Keyboard shortcuts
├── offline/            # Offline capabilities
│   ├── sync
│   └── storage
└── native/            # Native features
    ├── screen-capture
    ├── file-system
    └── hardware-monitor
```

### Extension Platform Routes (`ext/`)
```typescript
// Chrome Extension Features
ext/
├── popup/              # Extension popup
│   ├── quick-track    # Quick tracking
│   ├── timer         # Quick timer
│   └── settings      # Extension settings
├── background/        # Background features
│   ├── sync
│   └── notifications
└── content/          # Content scripts
    ├── tracker
    ├── blocker
    └── helper
```

## Implementation Guide

### 1. Route Configuration
```typescript
// Route configuration with platform support
interface RouteConfig {
  path: string;
  platforms: Platform[];
  component: Component;
  layout: Layout;
  meta: {
    requiresAuth: boolean;
    supportedScreens: Screen[];
    platformFeatures?: {
      desktop?: {
        systemIntegration?: boolean;
        offlineCapable?: boolean;
      };
      extension?: {
        popupView?: boolean;
        backgroundScript?: boolean;
        contentScript?: boolean;
      };
    };
  };
}

// Example route definitions
const routes: RouteConfig[] = [
  {
    path: '/',
    platforms: ['web'],
    component: Homepage,
    layout: MarketingLayout,
    meta: {
      requiresAuth: false,
      supportedScreens: ['all']
    }
  },
  {
    path: 'desktop/system/notifications',
    platforms: ['desktop'],
    component: SystemNotifications,
    layout: DesktopLayout,
    meta: {
      requiresAuth: true,
      supportedScreens: ['desktop'],
      platformFeatures: {
        desktop: {
          systemIntegration: true
        }
      }
    }
  },
  {
    path: 'ext/popup/quick-track',
    platforms: ['extension'],
    component: QuickTrack,
    layout: ExtensionPopupLayout,
    meta: {
      requiresAuth: true,
      supportedScreens: ['extension'],
      platformFeatures: {
        extension: {
          popupView: true
        }
      }
    }
  }
];
```

## Platform-Specific Considerations

### 1. Marketing Platform
- SEO optimization
- Performance optimization
- Analytics integration
- A/B testing support
- Conversion tracking

### 2. Desktop Platform
- Native OS integration
- System tray functionality
- Global shortcuts
- File system access
- Hardware monitoring

### 3. Extension Platform
- Browser API integration
- Popup interface
- Background scripts
- Content scripts
- Cross-origin handling

## Best Practices

1. Always use platform prefixes
2. Document platform support
3. Test across platforms
4. Consider platform-specific features
5. Maintain consistent patterns
6. Use appropriate layouts per platform
7. Handle platform transitions gracefully
8. Implement proper fallbacks

## Common Issues

### 1. Platform Detection
```typescript
// Enhanced platform detection
const detectPlatform = () => {
  const isDesktop = window.electron !== undefined;
  const isExtension = window.chrome?.extension !== undefined;
  const userAgent = navigator.userAgent;
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  
  if (isDesktop) return 'desktop';
  if (isExtension) return 'extension';
  return determineWebPlatform(userAgent, standalone);
};
```

## Monitoring

### 1. Usage Analytics
```typescript
// Track route usage per platform
const trackRouteUsage = (route: string, platform: Platform) => {
  analytics.track('route_access', {
    route,
    platform,
    timestamp: Date.now()
  });
};
```

### 2. Error Tracking
```typescript
// Monitor platform-specific issues
const trackPlatformError = (error: Error, platform: Platform) => {
  errorTracking.capture(error, {
    platform,
    route: getCurrentRoute(),
    context: getPlatformContext()
  });
};
```

## File Organization

### 1. Component Structure
```
src/
├── pages/
│   ├── marketing/
│   ├── web/
│   ├── app/
│   ├── mobile/
│   ├── desktop/
│   ├── extension/
│   └── shared/
├── layouts/
│   ├── MarketingLayout/
│   ├── WebLayout/
│   ├── AppLayout/
│   ├── MobileLayout/
│   ├── DesktopLayout/
│   ├── ExtensionPopupLayout/
│   └── ResponsiveLayout/
└── components/
    ├── marketing/
    ├── web/
    ├── app/
    ├── mobile/
    ├── desktop/
    ├── extension/
    └── shared/
```

### 2. Route Definitions
```typescript
// Platform-specific route files
src/
└── routes/
    ├── marketing.routes.ts
    ├── web.routes.ts
    ├── app.routes.ts
    ├── mobile.routes.ts
    ├── desktop.routes.ts
    ├── extension.routes.ts
    └── shared.routes.ts
```

## Documentation Requirements

### 1. Route Documentation
```typescript
/**
 * @route /
 * @platforms web
 * @layout MarketingLayout
 * @screens all
 * @description Main homepage
 */
```

### 2. Component Documentation
```typescript
/**
 * @component Homepage
 * @platforms web
 * @responsive true
 * @description Homepage component
 * @usage
 * - Web: Full feature set
 * - WebApp: Simplified interface
 * - Mobile: Not available
 */
```

## Testing Strategy

### 1. Platform Testing
```typescript
describe('Route Platform Support', () => {
  it('should render correct platform version', () => {
    const route = '/';
    const platform = getPlatformFromRoute(route);
    expect(platform).toBe('web');
  });
});
```

### 2. Responsive Testing
```typescript
describe('Layout Responsiveness', () => {
  it('should adapt to screen size', () => {
    const layout = getLayout('app/dashboard', 'webapp');
    expect(layout.isResponsive).toBe(true);
  });
});
```

## Migration Guide

### 1. Legacy Routes
- Document old route patterns
- Provide migration path
- Support temporary redirects

### 2. New Routes
- Follow platform prefixing
- Update documentation
- Add platform support

## Migration Strategy

### 1. Route Migration
```typescript
// Migrate old routes to new platform-based routes
const migrateRoutes = () => {
  const oldRoutes = getLegacyRoutes();
  const newRoutes = oldRoutes.map(route => {
    const platform = detectPlatformFromRoute(route);
    return {
      path: `${platform}/${route}`,
      platforms: [platform],
      component: getComponentForRoute(route),
      layout: getLayoutForRoute(route),
      meta: getMetaForRoute(route)
    };
  });
  return newRoutes;
};
```

### 2. Component Migration
```typescript
// Migrate old components to new platform-based components
const migrateComponents = () => {
  const oldComponents = getLegacyComponents();
  const newComponents = oldComponents.map(component => {
    const platform = detectPlatformFromComponent(component);
    return {
      name: `${platform}-${component.name}`,
      platforms: [platform],
      component: component.component,
      props: component.props,
      meta: component.meta
    };
  });
  return newComponents;
};
```

## Conclusion

By following this routing strategy, we can ensure a consistent and scalable architecture for our application, allowing us to easily add new features and platforms while maintaining a high level of maintainability and performance.
