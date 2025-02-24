# CMS Tools Integration (SSOT)

## Purpose and Scope

### Primary Purpose
These CMS tools are implemented SOLELY as additional support tools for:
- Content preview
- Content editing
- Content publishing

### NOT Replacing
These tools explicitly DO NOT replace:
- The Well-Charged application
- Our existing tech stack
- Our core functionality
- Our database structure
- Our API architecture

## Integrated CMS Tools

### 1. TinaCMS
- Purpose: Visual content editing and preview
- Integration Path: `/tools/cms/tina`
- Stack Impact: None (Additional tool only)
- Primary Use: Content editing with live preview

### 2. Sanity
- Purpose: Real-time collaborative editing
- Integration Path: `/tools/cms/sanity`
- Stack Impact: None (Additional tool only)
- Primary Use: Team content collaboration

### 3. Payload CMS
- Purpose: Self-hosted content management
- Integration Path: `/tools/cms/payload`
- Stack Impact: None (Additional tool only)
- Primary Use: Advanced content workflows

### 4. Strapi
- Purpose: Content structure management
- Integration Path: `/tools/cms/strapi`
- Stack Impact: None (Additional tool only)
- Primary Use: Content modeling and editing

### 5. Keystone
- Purpose: TypeScript-native content management
- Integration Path: `/tools/cms/keystone`
- Stack Impact: None (Additional tool only)
- Primary Use: Type-safe content editing

### 6. Builder.io
- Purpose: Visual page building
- Integration Path: `/tools/cms/builder`
- Stack Impact: None (Additional tool only)
- Primary Use: Visual content assembly

### 7. Decap CMS
- Purpose: Git-based content management
- Integration Path: `/tools/cms/decap`
- Stack Impact: None (Additional tool only)
- Primary Use: Git-workflow content editing

### 8. Storyblok
- Purpose: Component-based content editing
- Integration Path: `/tools/cms/storyblok`
- Stack Impact: None (Additional tool only)
- Primary Use: Component content management

## Integration Guidelines

### 1. Isolation
- All CMS tools must be isolated in `/tools/cms/*`
- No interference with main application
- Separate routing and state management

### 2. Data Flow
- Read-only access to main application data
- Changes sync through our existing API
- No direct database modifications

### 3. Authentication
- Use existing auth system
- No separate user management
- Respect existing permissions

### 4. Performance
- Lazy loading of CMS tools
- No impact on main app performance
- Independent resource management

## Usage Rules

### 1. Content Editing
- Use CMS tools only for content management
- No core functionality modifications
- No database schema changes

### 2. Preview
- Preview changes before publication
- No direct production updates
- Use existing deployment workflow

### 3. Publishing
- Follow existing deployment process
- Maintain content versioning
- Respect content approval workflow

## Implementation Process

### 1. Setup Phase
```bash
# Install all CMS tools
npm install tinacms @tinacms/cli
npm install @sanity/client @sanity/preview-kit
npm install payload
npx create-strapi-app@latest
npm install @keystonejs/core
npm install @builder.io/react
npm install decap-cms-app
npm install @storyblok/react
```

### 2. Integration Phase
```typescript
// src/router.tsx
{
  path: '/tools/cms',
  children: [
    {
      path: 'tina',
      element: <TinaCMSWrapper />
    },
    {
      path: 'sanity',
      element: <SanityWrapper />
    },
    {
      path: 'payload',
      element: <PayloadWrapper />
    },
    {
      path: 'strapi',
      element: <StrapiWrapper />
    },
    {
      path: 'keystone',
      element: <KeystoneWrapper />
    },
    {
      path: 'builder',
      element: <BuilderWrapper />
    },
    {
      path: 'decap',
      element: <DecapWrapper />
    },
    {
      path: 'storyblok',
      element: <StoryblokWrapper />
    }
  ]
}
```

### 3. Testing Phase
- Test each CMS independently
- Verify no main app impact
- Validate content workflows

## Maintenance

### 1. Updates
- Update CMS tools independently
- No impact on main app updates
- Maintain compatibility checks

### 2. Monitoring
- Monitor CMS tool performance
- Track usage patterns
- Identify optimal tools

### 3. Documentation
- Maintain separate CMS docs
- Update integration guides
- Document best practices
