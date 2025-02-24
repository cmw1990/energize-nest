# Platform Features Matrix (SSOT)

## Overview

This document serves as the single source of truth for feature availability across different platforms in the Well-Charged ecosystem.

## Platform Purposes

### Web Platform (`web/*`)
**Primary Purpose**: Marketing, documentation, and public-facing content
- Target Audience: New users, developers, content readers
- Access: Via web browsers
- Focus: Information, conversion, documentation

### WebApp Platform (`webapp/*`)
**Primary Purpose**: Core application functionality
- Target Audience: Regular users, power users
- Access: Via web browsers
- Focus: Full feature set, data management

### MobileApp Platform (`mobileapp/*`)
**Primary Purpose**: On-the-go access and mobile-specific features
- Target Audience: Mobile users
- Access: Via mobile app (iOS/Android)
- Focus: Quick actions, native features

### PCApp Platform (`pcapp/*`)
**Primary Purpose**: Desktop integration and advanced features
- Target Audience: Power users, professionals
- Access: Via desktop application
- Focus: System integration, advanced tools

### Extension Platform (`ext/*`)
**Primary Purpose**: Quick access and browser integration
- Target Audience: Browser users
- Access: Via Chrome extension
- Focus: Quick actions, content enhancement

## Feature Availability Matrix

| Feature Category | Web | WebApp | MobileApp | PCApp | Extension |
|-----------------|-----|--------|-----------|--------|------------|
| **Core Features** |
| User Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ (mini) |
| Energy Tracking | ❌ | ✅ | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ | ✅ | ❌ |
| Settings | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Health Features** |
| Sleep Tracking | ❌ | ✅ | ✅ | ✅ | ❌ |
| Exercise Plans | ❌ | ✅ | ✅ | ✅ | ❌ |
| Mental Health | ❌ | ✅ | ✅ | ✅ | ❌ |
| Recovery | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Memory Features** |
| Memory Hub | ❌ | ✅ | ✅ | ✅ | ✅ (mini) |
| Memory Training | ❌ | ✅ | ✅ | ✅ | ✅ (basic) |
| Memory Journal | ❌ | ✅ | ✅ | ✅ | ✅ (quick) |
| Memory Assessment | ❌ | ✅ | ✅ | ✅ | ❌ |
| Memory Care | ❌ | ✅ | ✅ | ✅ | ✅ (alerts) |
| Memory Albums | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Content** |
| Blog | ✅ | ✅ | ✅ | ✅ | ❌ |
| Documentation | ✅ | ❌ | ❌ | ❌ | ❌ |
| Marketing | ✅ | ❌ | ❌ | ❌ | ❌ |
| Help Center | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Platform-Specific** |
| Quick Timer | ❌ | ✅ | ✅ | ✅ | ✅ |
| System Notifications | ❌ | ✅ | ✅ | ✅ | ✅ |
| File Export | ❌ | ✅ | ❌ | ✅ | ❌ |
| Screen Tracking | ❌ | ❌ | ❌ | ✅ | ✅ |
| Quick Add | ❌ | ✅ | ✅ | ✅ | ✅ |

## Platform-Specific Features

### Web-Only Features
```typescript
// Marketing and Information
web/
├── landing/           # Landing pages
├── marketing/         # Marketing content
├── blog/             # Blog posts
└── docs/             # Documentation
```

### WebApp-Specific Features
```typescript
// Core Application Features
webapp/
├── dashboard/        # Main dashboard
├── analytics/        # Advanced analytics
├── reports/         # Detailed reports
├── memory/          # Memory features
│   ├── hub/         # Memory dashboard
│   ├── training/    # Memory exercises
│   ├── journal/     # Memory journal
│   ├── assessment/  # Memory assessment
│   ├── care/        # Memory care tools
│   └── albums/      # Memory albums
└── settings/        # Full settings
```

### MobileApp-Specific Features
```typescript
// Mobile-Optimized Features
mobileapp/
├── quick-track/     # Quick tracking interface
├── notifications/   # Mobile notifications
├── offline/         # Offline support
├── sensors/         # Device sensors integration
├── memory/          # Memory features
│   ├── quick-entry/ # Quick memory capture
│   ├── location/    # Location tracking
│   ├── voice/       # Voice notes
│   └── alerts/      # Memory care alerts
└── settings/        # Mobile settings
```

### PCApp-Specific Features
```typescript
// Desktop Integration
pcapp/
├── system-monitor/  # System monitoring
├── memory/          # Memory features
│   ├── advanced/    # Advanced memory tools
│   ├── backup/      # Memory data backup
│   ├── import/      # Data import tools
│   └── export/      # Data export tools
├── screen-track/   # Screen time tracking
├── file-export/    # Advanced export
└── shortcuts/      # Global shortcuts
```

### Extension-Specific Features
```typescript
// Browser Integration
ext/
├── quick-timer/    # Browser-based timer
├── page-track/    # Page tracking
├── quick-add/    # Quick data entry
└── mini-dash/    # Mini dashboard
```

## Cross-Platform Features

### Shared Components
Features that must be consistent across all platforms:
- User preferences
- Data visualization
- Core tracking functionality
- Settings sync

### Platform-Specific Implementations
How core features adapt to each platform:

#### Dashboard Example
```typescript
// Web App Dashboard
- Full-width layout
- Advanced filters
- Multiple views

// Mobile App Dashboard
- Simplified layout
- Touch-optimized
- Quick actions

// PC App Dashboard
- Multi-window support
- System integration
- Advanced features

// Extension Dashboard
- Compact view
- Essential metrics
- Quick actions
```

## Feature Implementation Guidelines

### 1. Core Feature Requirements
- Must work offline
- Data must sync across platforms
- Consistent user experience
- Platform-appropriate UI

### 2. Platform-Specific Requirements

#### Web Platform
- SEO optimization
- Fast initial load
- Social sharing
- Print layouts

#### WebApp Platform
- Progressive enhancement
- Responsive design
- Keyboard shortcuts
- Advanced features

#### MobileApp Platform
- Touch optimization
- Battery efficiency
- Offline first
- Native integration

#### PCApp Platform
- System integration
- Multiple windows
- File system access
- Global shortcuts

#### Extension Platform
- Quick access
- Minimal footprint
- Browser integration
- Context menus

## Feature Addition Process

### 1. Evaluation
- Determine target platforms
- Assess platform capabilities
- Define feature scope
- Plan implementation

### 2. Implementation
- Start with core functionality
- Add platform-specific features
- Ensure cross-platform compatibility
- Test platform-specific features

### 3. Testing
- Platform-specific testing
- Cross-platform testing
- Feature parity testing
- Performance testing

## Maintenance Guidelines

### 1. Feature Updates
- Update all affected platforms
- Maintain feature parity
- Document platform differences
- Test cross-platform

### 2. Platform Updates
- Monitor platform changes
- Update platform-specific code
- Test platform compatibility
- Update documentation

## Version Control

### Feature Branches
```typescript
feature/
├── core/            # Core feature implementation
├── web/            # Web-specific implementation
├── webapp/         # WebApp-specific implementation
├── mobileapp/      # MobileApp-specific implementation
├── pcapp/          # PCApp-specific implementation
└── ext/            # Extension-specific implementation
```

## Documentation Requirements

### For Each Feature
- Platform availability
- Platform-specific behavior
- Implementation differences
- Testing requirements

### For Each Platform
- Feature list
- Platform limitations
- Special considerations
- Best practices
