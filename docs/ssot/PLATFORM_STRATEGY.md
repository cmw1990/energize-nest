# Platform Strategy Guide

## Overview
Well-Charged is a pan-platform application that runs on web browsers, progressive web apps (PWA), and native mobile apps through Capacitor. This document serves as the single source of truth for platform-specific implementations and considerations.

## Platform Matrix

### Page Availability Matrix

| Page/Feature          | Web | Web App | Mobile App | Notes |
|----------------------|-----|----------|------------|--------|
| Landing              | ✅   | ✅        | ❌         | Mobile app uses direct login |
| Dashboard            | ✅   | ✅        | ✅         | Responsive layout |
| Energy Plans         | ✅   | ✅        | ✅         | Touch optimized on mobile |
| Analytics            | ✅   | ✅        | ✅         | Simplified charts on mobile |
| Focus Timer          | ✅   | ✅        | ✅         | Background service on mobile |
| Sleep Tracking       | ✅   | ✅        | ✅         | Native sensors on mobile |
| Exercise             | ✅   | ✅        | ✅         | GPS integration on mobile |
| Mental Health        | ✅   | ✅        | ✅         | Offline support |
| Recovery             | ✅   | ✅        | ✅         | Native notifications |
| Consultation        | ✅   | ✅        | ✅         | Video optimized |
| Settings            | ✅   | ✅        | ✅         | Platform-specific options |

## Layout Strategy

### Web Browser
- Full-width layout
- Sidebar navigation
- Dropdown menus
- Hover states
- Multi-column layouts
```jsx
<WebLayout>
  <Sidebar />
  <MainContent>
    <Header />
    <PageContent />
  </MainContent>
</WebLayout>
```

### Web App (PWA)
- Responsive layout
- Collapsible sidebar
- Touch targets
- App-like navigation
```jsx
<PWALayout>
  <Header />
  <DrawerNavigation />
  <PageContent />
  <BottomNav />
</PWALayout>
```

### Mobile App
- Native-like experience
- Bottom tab navigation
- Swipe gestures
- Full-screen modals
```jsx
<MobileLayout>
  <SafeArea>
    <PageContent />
    <TabBar />
  </SafeArea>
</MobileLayout>
```

## Navigation Patterns

### Web Browser
- URL-based navigation
- Browser history
- Multiple tabs support
- Keyboard shortcuts

### Web App
- App-like navigation
- History API
- Screen transitions
- Touch gestures

### Mobile App
- Native navigation stack
- Hardware back button
- Deep linking
- Tab-based navigation

## Platform-Specific Features

### Web Browser
- Keyboard shortcuts
- Right-click menus
- Drag and drop
- Multiple windows

### Web App
- Offline support
- Push notifications
- Home screen installation
- Share API

### Mobile App
- Native sensors
- Background services
- Local notifications
- Deep linking

## Responsive Design Strategy

### Breakpoints
```css
// Mobile first
xs: 0,      // Mobile portrait
sm: 576px,  // Mobile landscape
md: 768px,  // Tablet portrait
lg: 992px,  // Tablet landscape/small desktop
xl: 1200px, // Desktop
2xl: 1536px // Large desktop
```

### Layout Grid
```css
// Container widths
mobile: 100%
tablet: 768px
desktop: 1024px
wide: 1280px
```

## Platform Detection

```typescript
// Platform detection utility
export const getPlatform = () => {
  const isMobile = window.innerWidth <= 768;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isNative = window.Capacitor !== undefined;
  
  return {
    isMobile,
    isStandalone,
    isNative,
    isWebApp: isStandalone && !isNative,
    isWebBrowser: !isStandalone && !isNative
  };
};
```

## Component Guidelines

### Shared Components
Components that work across all platforms with responsive design:
- Buttons
- Cards
- Forms
- Lists
- Modals

### Platform-Specific Components
Components that need platform-specific implementations:
- Navigation bars
- Menus
- Action sheets
- Date pickers
- File uploads

## Testing Strategy

### Cross-Platform Testing
- Visual regression testing
- Touch interaction testing
- Responsive layout testing
- Platform feature testing

### Platform-Specific Testing
- Native API testing
- Offline functionality
- Push notifications
- Deep linking

## Performance Considerations

### Web Browser
- Bundle size optimization
- Code splitting
- Resource caching
- SEO optimization

### Web App
- Service worker caching
- Background sync
- Lazy loading
- State persistence

### Mobile App
- Native API optimization
- Memory management
- Battery optimization
- Network handling

## Development Workflow

### Local Development
1. Start with web browser development
2. Test PWA features
3. Build and test mobile features
4. Cross-platform testing

### Testing Process
1. Unit tests per platform
2. Integration tests
3. Platform-specific testing
4. End-to-end testing

### Deployment Process
1. Web deployment
2. PWA updates
3. Mobile app store releases

## Common Issues and Solutions

### Navigation
- Issue: Back button behavior differs across platforms
- Solution: Use platform-specific navigation handlers

### Layout
- Issue: Touch targets too small on mobile
- Solution: Use platform-specific sizing utilities

### Performance
- Issue: Slow initial load on mobile
- Solution: Implement progressive loading

## Best Practices

1. Always start with mobile-first design
2. Use platform detection for specific features
3. Maintain consistent user experience
4. Test on all target platforms
5. Document platform-specific behaviors

## Future Considerations

1. Desktop app support
2. Tablet-optimized layouts
3. Foldable device support
4. New platform features

## Platforms Overview

### Main Platforms
- `web/*` - All web pages (marketing, docs, public tools)
- `webapp/*` - Web application features
- `mobileapp/*` - Mobile application features
- `pcapp/*` - Desktop application features
- `ext/*` - Chrome extension features

### Test Environments
- `webapp2/*` - Test version of web application features
- `mobileapp2/*` - Test version of mobile application features (planned)
- `pcapp2/*` - Test version of desktop application features (planned)
- `ext2/*` - Test version of extension features (planned)

Test environments mirror their production counterparts but allow for isolated development and testing. For detailed information, see [Test Environment documentation](./development/TEST_ENVIRONMENT.md).

## Platform Features

### Web (`web/*`)
- Marketing pages
- Documentation
- Public tools
- Blog posts
- SEO optimized
