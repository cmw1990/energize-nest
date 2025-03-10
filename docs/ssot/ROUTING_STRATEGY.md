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

## Standalone Tools Routing

### 7. Standalone App Routes (`apps/`)
```typescript
// Standalone Applications
apps/
├── mood/                 # Mood tracking standalone app
│   ├── dashboard
│   ├── tracking
│   └── insights
├── quit-smoking/         # Quit smoking standalone app
│   ├── progress
│   ├── milestones
│   └── community
└── sleep/               # Sleep tracking standalone app
    ├── tracking
    ├── analysis
    └── recommendations
```

## Standalone Tools as Native Mobile Apps

### Capacitor Integration

Each standalone app can be wrapped with Capacitor to create dedicated native mobile apps while maintaining shared code:

```typescript
// Platform support for standalone apps
interface StandaloneAppConfig {
  id: string;
  name: string;
  routes: string[];
  supportedPlatforms: {
    web: boolean;        // As part of main web platform
    standalone: boolean; // As standalone web app
    mobile: boolean;     // As Capacitor-wrapped mobile app
    desktop: boolean;    // As Electron desktop app
  };
  entryPoints: {
    web: string;         // Entry component for web integration
    standalone: string;  // Entry component for standalone web app
    mobile: string;      // Entry component for mobile app
    desktop: string;     // Entry component for desktop app
  };
}

// Example configuration for mood tracking app
const moodAppConfig: StandaloneAppConfig = {
  id: 'mood',
  name: 'Mood Tracker',
  routes: ['apps/mood/*'],
  supportedPlatforms: {
    web: true,
    standalone: true,
    mobile: true,
    desktop: false
  },
  entryPoints: {
    web: 'MoodIntegrationComponent',
    standalone: 'MoodStandaloneApp',
    mobile: 'MoodMobileApp',
    desktop: null
  }
};
```

### Mobile App Structure

For Capacitor-wrapped mobile applications, each app would have a specific mobile-optimized entry point:

```
apps/
├── mood/
│   ├── web/              # Web version
│   ├── mobile/           # Mobile-specific implementation
│   │   ├── capacitor.config.ts  # Capacitor configuration
│   │   ├── android/      # Android-specific files
│   │   ├── ios/          # iOS-specific files
│   │   └── entry.ts      # Mobile entry point
│   └── shared/           # Shared business logic
├── quit-smoking/
│   ├── web/
│   ├── mobile/
│   └── shared/
└── sleep/
    ├── web/
    ├── mobile/
    └── shared/
```

## Multi-Domain Support for Standalone Apps

Each standalone app can be deployed to its own domain while maintaining shared code and services:

```typescript
// Domain configuration for standalone apps
interface AppDomainConfig {
  id: string;
  name: string;
  primaryDomain: string;
  alternativeDomains: string[];
  apiPath: string;
  authConfig: {
    sharedAuth: boolean;       // Whether to use shared authentication
    cookieDomain: string;      // Domain for auth cookies (e.g., ".yourbrand.com")
    ssoEnabled: boolean;       // Enable Single Sign-On between apps
  };
  deploymentConfig: {
    buildCommand: string;
    outputDir: string;
    envVariables: Record<string, string>;
  };
}

// Example configuration for mood tracking app
const moodAppDomainConfig: AppDomainConfig = {
  id: 'mood',
  name: 'Mood Tracker',
  primaryDomain: 'mood.yourbrand.com',
  alternativeDomains: ['www.moodtracker.app', 'moodtracker.yourbrand.com'],
  apiPath: '/api/mood',
  authConfig: {
    sharedAuth: true,
    cookieDomain: '.yourbrand.com',
    ssoEnabled: true
  },
  deploymentConfig: {
    buildCommand: 'nx build mood-app --prod',
    outputDir: 'dist/apps/mood-app',
    envVariables: {
      'VITE_APP_NAME': 'Mood Tracker',
      'VITE_API_BASE': 'https://api.yourbrand.com/mood'
    }
  }
};

// Example configuration for quit smoking app
const quitSmokingAppDomainConfig: AppDomainConfig = {
  id: 'quit-smoking',
  name: 'Quit Smoking',
  primaryDomain: 'quit.yourbrand.com',
  alternativeDomains: ['www.quitsmokingapp.com'],
  apiPath: '/api/quit-smoking',
  authConfig: {
    sharedAuth: true,
    cookieDomain: '.yourbrand.com',
    ssoEnabled: true
  },
  deploymentConfig: {
    buildCommand: 'nx build quit-smoking-app --prod',
    outputDir: 'dist/apps/quit-smoking-app',
    envVariables: {
      'VITE_APP_NAME': 'Quit Smoking',
      'VITE_API_BASE': 'https://api.yourbrand.com/quit-smoking'
    }
  }
};
```

### Domain Resolution Flow

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│  mood.yourbrand.com ├────►│  Mood Tracker App   │     │  Shared Auth        │
│                     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────┬───────────┘
                                                                  │
┌─────────────────────┐     ┌─────────────────────┐               │
│                     │     │                     │               │
│  quit.yourbrand.com ├────►│  Quit Smoking App   ├───────────────┘
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│  yourbrand.com      ├────►│  Main Platform      │
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘
```

### DNS Configuration

Each standalone app requires its own DNS entry:

```
# DNS Configuration
mood.yourbrand.com       CNAME  mood-app.netlify.app
quit.yourbrand.com       CNAME  quit-app.netlify.app
www.moodtracker.app      CNAME  mood-app.netlify.app
yourbrand.com            CNAME  main-app.netlify.app
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

## Route Structure

### Platform-Specific Routes

Each platform has its own dedicated route prefix to maintain clear separation:

| Platform | Route Prefix | Purpose |
|----------|--------------|---------|
| Web | `/` (root) | Marketing, documentation, and public content |
| WebApp | `/webapp/*` | Web application features |
| MobileApp | `/mobileapp/*` | Mobile application features |
| PCApp | `/pcapp/*` | Desktop application features |
| Extension | `/ext/*` | Browser extension features |

### Test Environment Routes

Each platform also has a corresponding test environment with a similar route structure:

| Platform | Production Route | Test Route | Purpose |
|----------|-----------------|------------|---------|
| WebApp | `/webapp/*` | `/webapp2/*` | Testing web application features |
| MobileApp | `/mobileapp/*` | `/mobileapp2/*` | Testing mobile application features (planned) |
| PCApp | `/pcapp/*` | `/pcapp2/*` | Testing desktop application features (planned) |
| Extension | `/ext/*` | `/ext2/*` | Testing browser extension features (planned) |

Test routes should mirror their production counterparts exactly, using the same components but allowing for isolated development and testing.

For detailed information about test environments, refer to the [Test Environment documentation](./development/TEST_ENVIRONMENT.md).

## Route-Based Multi-App Strategy

As an alternative to the monorepo approach, we can implement a route-based strategy for our standalone applications:

```typescript
// Route-based multi-app configuration
interface RouteBasedAppConfig {
  id: string;
  name: string;
  slug: string;
  domains: string[];
  routes: string[];
  features: string[];
  theme: {
    primary: string;
    secondary: string;
    logo: string;
  };
  navigation: {
    enabled: boolean;
    items: Array<{
      label: string;
      path: string;
      icon: string;
    }>;
  };
}

// Example configurations
const apps: RouteBasedAppConfig[] = [
  {
    id: 'main',
    name: 'Wellness Platform',
    slug: 'wellness',
    domains: ['yourbrand.com', 'www.yourbrand.com'],
    routes: ['/'],
    features: ['dashboard', 'profile', 'settings', 'all-tools'],
    theme: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      logo: '/logos/main-logo.svg'
    },
    navigation: {
      enabled: true,
      items: [
        { label: 'Dashboard', path: '/', icon: 'dashboard' },
        { label: 'Tools', path: '/tools', icon: 'tools' },
        { label: 'Profile', path: '/profile', icon: 'user' }
      ]
    }
  },
  {
    id: 'mood',
    name: 'Mood Tracker',
    slug: 'mood',
    domains: ['mood.yourbrand.com', 'moodtracker.app'],
    routes: ['/mood', '/apps/mood'],
    features: ['mood-tracking', 'mood-insights', 'mood-journal'],
    theme: {
      primary: '#8A4FFF',
      secondary: '#C2A0FF',
      logo: '/logos/mood-logo.svg'
    },
    navigation: {
      enabled: true,
      items: [
        { label: 'Dashboard', path: '/', icon: 'dashboard' },
        { label: 'Track', path: '/track', icon: 'plus' },
        { label: 'Journal', path: '/journal', icon: 'book' },
        { label: 'Insights', path: '/insights', icon: 'chart' }
      ]
    }
  }
];
```

### Application Structure

In a route-based approach, we maintain a single application that configures itself based on the current domain or route:

```
src/
├── apps/                   # App-specific code
│   ├── main/               # Main wellness platform
│   │   ├── routes.tsx      # Main app routes
│   │   ├── components/     # App-specific components
│   │   └── config.ts       # App configuration
│   ├── mood/               # Mood tracker app
│   │   ├── routes.tsx      # Mood app routes
│   │   ├── components/     # App-specific components
│   │   └── config.ts       # App configuration
│   └── quit-smoking/       # Quit smoking app
│       ├── routes.tsx      # Quit smoking app routes
│       ├── components/     # App-specific components
│       └── config.ts       # App configuration
├── shared/                 # Shared code
│   ├── components/         # Shared components
│   ├── hooks/              # Shared hooks
│   ├── api/                # Shared API services
│   └── utils/              # Shared utilities
├── core/                   # Core application logic
│   ├── App.tsx             # Main app component
│   ├── AppRouter.tsx       # Domain/route-aware router
│   ├── AppConfig.ts        # App configuration handler
│   └── DomainResolver.ts   # Domain detection logic
└── index.tsx               # Entry point
```

### Domain Resolution and App Configuration

The application detects the current domain and configures itself accordingly:

```typescript
// DomainResolver.ts
export const resolveApp = (): RouteBasedAppConfig => {
  const hostname = window.location.hostname;
  const path = window.location.pathname;
  
  // Find app by domain
  const appByDomain = apps.find(app => 
    app.domains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  );
  
  if (appByDomain) return appByDomain;
  
  // Find app by route
  const appByRoute = apps.find(app => 
    app.routes.some(route => path.startsWith(route))
  );
  
  if (appByRoute) return appByRoute;
  
  // Default to main app
  return apps.find(app => app.id === 'main')!;
};

// AppConfig.ts
export const useAppConfig = () => {
  const [currentApp, setCurrentApp] = useState<RouteBasedAppConfig | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const app = resolveApp();
    setCurrentApp(app);
    
    // Configure app theme
    document.documentElement.style.setProperty('--primary-color', app.theme.primary);
    document.documentElement.style.setProperty('--secondary-color', app.theme.secondary);
    document.title = app.name;
    
    // Update favicon and metadata
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.setAttribute('href', app.theme.logo);
    
  }, [location.pathname]);
  
  return currentApp;
};
```

### Capacitor Integration with Route-Based Approach

For Capacitor mobile apps, we can create app-specific builds while reusing the same codebase:

```typescript
// capacitor.config.ts for Mood Tracker app
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourbrand.mood',
  appName: 'Mood Tracker',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    hostname: 'mood.yourbrand.com',
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8A4FFF',
      androidSplashResourceName: 'splash_mood',
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;
```

### Build Configuration for Multiple Apps

To build app-specific versions for deployment:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Get app ID from environment variables
const appId = process.env.APP_ID || 'main';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.APP_ID': JSON.stringify(appId),
    'process.env.IS_CAPACITOR': process.env.IS_CAPACITOR === 'true'
  },
  build: {
    outDir: `dist/${appId}`,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000
  }
});
```

### Pros of Route-Based Approach

1. **Single Codebase**: Maintain one codebase rather than multiple separate projects
2. **Simplified Deployment**: Deploy a single application with different configurations
3. **Consistent User Experience**: Shared components ensure consistent UX
4. **Streamlined Development**: Avoid jumping between projects
5. **Efficient Dependency Management**: No duplication of dependencies across projects
6. **Smaller Bundle Size**: Shared code is not duplicated

### Cons of Route-Based Approach

1. **More Complex Runtime Logic**: Needs domain/route detection logic
2. **Potential Bloat**: Main bundle includes code for all apps
3. **Developer Isolation Challenges**: Harder to isolate development work
4. **Version Synchronization**: All apps must update simultaneously
5. **Testing Complexity**: Testing domain-specific behavior requires more setup
