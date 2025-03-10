# CMS Integration Testing Guide

## Overview
This document outlines the setup and testing procedures for each CMS tool. These tools are NOT replacing our core application but serve as additional content management support.

## CMS Tools Setup

### 1. TinaCMS Setup
```bash
# Install TinaCMS
npm install tinacms @tinacms/cli

# Initialize TinaCMS (in /tools/cms/tina)
npx @tinacms/cli init --framework react

# Configuration
NEXT_PUBLIC_TINA_CLIENT_ID=<your-client-id>
TINA_TOKEN=<your-token>
```

### 2. Sanity Setup
```bash
# Install Sanity
npm install @sanity/client @sanity/preview-kit

# Initialize Sanity project
npm create sanity@latest -- --template clean --create-project "well-charged-cms" --dataset production

# Configuration
SANITY_PROJECT_ID=<your-project-id>
SANITY_DATASET=production
```

### 3. Payload CMS Setup
```bash
# Install Payload
npm install payload

# Initialize Payload (in /tools/cms/payload)
npx create-payload-app

# Configuration
PAYLOAD_SECRET=<your-secret>
MONGODB_URI=<your-mongodb-uri>
```

### 4. Builder.io Setup
```bash
# Install Builder.io
npm install @builder.io/react

# Configuration
BUILDER_API_KEY=<your-api-key>
```

### 5. Decap CMS Setup
```bash
# Install Decap CMS
npm install decap-cms-app

# Configuration (in /public/admin/config.yml)
backend:
  name: git-gateway
  branch: main
```

### 6. Storyblok Setup
```bash
# Install Storyblok
npm install @storyblok/react

# Configuration
STORYBLOK_ACCESS_TOKEN=<your-token>
```

### 7. Keystone Setup
```bash
# Install Keystone
npm install @keystonejs/keystone @keystonejs/auth-password @keystonejs/app-admin-ui

# Initialize Keystone (in /tools/cms/keystone)
npx create-keystone-app

# Configuration
SESSION_SECRET=<your-secret>
DATABASE_URL=<your-database-url>
```

## Decap CMS Integration

### Overview
Decap CMS (formerly Netlify CMS) is a Git-based content management system that offers:
- Direct Git integration
- Markdown and rich text editing
- Media management
- Custom widgets and previews

### Implementation Details
The Decap CMS test environment is available at `/tools/cms/decap` and includes:
1. Markdown editor with preview
2. Tag management system
3. Content status tracking
4. Git-based saving (simulated)

### Features
- Real-time markdown preview
- Tag management with add/remove functionality
- Content status (draft/published)
- Last modified tracking

### Testing Instructions
1. Access the Decap CMS test environment
2. Create and edit content using the markdown editor
3. Add and remove tags
4. Toggle between edit and preview modes
5. Test the save functionality

### Cross-References
- See `PLATFORM_FEATURES.md` for complete CMS feature comparison
- See `DEVELOPMENT_STATUS.md` for integration status
- See `SECURITY.md` for Git-based CMS security considerations

## Testing Process

### 1. Content Creation Test
1. Create a new content piece
2. Add text, images, and formatting
3. Save as draft
4. Preview changes
5. Publish content

### 2. Content Editing Test
1. Edit existing content
2. Update formatting
3. Add new sections
4. Preview changes
5. Save updates

### 3. Media Management Test
1. Upload images
2. Manage media library
3. Insert media into content
4. Optimize images
5. Delete media

### 4. Workflow Test
1. Create draft
2. Request review
3. Make revisions
4. Approve changes
5. Publish content

### 5. Integration Test
1. Connect to API
2. Fetch content
3. Display in app
4. Update content
5. Verify changes

## Evaluation Criteria

### 1. Ease of Use
- [ ] Intuitive interface
- [ ] Clear workflow
- [ ] Good documentation
- [ ] Quick learning curve

### 2. Features
- [ ] Rich text editing
- [ ] Media management
- [ ] Version control
- [ ] Preview capabilities

### 3. Performance
- [ ] Load time
- [ ] Edit response time
- [ ] Preview generation
- [ ] Publishing speed

### 4. Integration
- [ ] API quality
- [ ] SDK availability
- [ ] Documentation clarity
- [ ] Implementation effort

### 5. Cost
- [ ] Free tier limits
- [ ] Pricing structure
- [ ] Hidden costs
- [ ] Enterprise features

## Usage Instructions

### 1. Access CMS Testing
```typescript
// Visit CMS testing environment
http://localhost:8001/tools/cms
```

### 2. Test Each CMS
1. Click on a CMS card
2. Create test content
3. Edit and preview
4. Test publishing
5. Document findings

### 3. Compare Results
1. Fill evaluation criteria
2. Note pros and cons
3. Test performance
4. Check integration
5. Review pricing

## Security Notes
- All CMS tools run in isolated environments
- No production data access
- Test with sample content only
- No sensitive information

## Next Steps
1. Complete all CMS setups
2. Run thorough testing
3. Document findings
4. Make recommendations
5. Plan implementation
