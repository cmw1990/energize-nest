# CMS Usage Guide

## Accessing CMS Tools

### Main Entry Point
- URL: `http://localhost:8001/tools/cms`
- Lists all available CMS options
- No authentication required in development mode

### Available CMS Tools

1. Builder.io CMS
   - Path: `/tools/cms/builder`
   - Features: Visual Editor, Component Library, Real-time Preview

2. Sanity CMS
   - Path: `/tools/cms/sanity`
   - Features: GROQ Query Language, Real-time Updates, Custom Schemas

3. Decap CMS
   - Path: `/tools/cms/decap`
   - Features: Git Integration, Markdown Editor, Media Management

4. TinaCMS
   - Path: `/tools/cms/tina`
   - Features: Visual Editing, Git Integration, Custom Fields

5. Keystone CMS
   - Path: `/tools/cms/keystone`
   - Features: GraphQL API, Custom Fields, Access Control

6. Payload CMS
   - Path: `/tools/cms/payload`
   - Features: REST & GraphQL APIs, Custom Fields, Media Library

7. Storyblok CMS
   - Path: `/tools/cms/storyblok`
   - Features: Visual Editor, Component System, Asset Management

## Content Types

### Blog Posts
- Location: `content/blog`
- Format: Markdown with YAML frontmatter
- Fields:
  - Title (required)
  - Publish Date (required)
  - Description
  - Featured Image (optional)
  - Body (markdown)
  - Tags (list)

### Documentation
- Location: `content/docs`
- Format: Markdown with YAML frontmatter
- Fields:
  - Title (required)
  - Description
  - Category (Platform/Technical/Development)
  - Order
  - Body (markdown)

### Settings
- Location: `content/settings`
- Format: YAML
- Fields:
  - Site Title
  - Site Description
  - Keywords
  - Author

## Usage Instructions

### Creating Content
1. Navigate to `/tools/cms`
2. Choose your preferred CMS
3. Click "New" or "Create" button
4. Fill in required fields
5. Use editor for content
6. Preview changes
7. Save to commit

### Editing Content
1. Navigate to `/tools/cms`
2. Choose your preferred CMS
3. Select content from list
4. Make changes in editor
5. Preview changes
6. Save to commit

### Managing Media
- Upload images to `static/images`
- Reference in content as `/images/filename.ext`
- Supported formats: jpg, png, gif, svg

### Working with Git
- Each save creates a commit
- Changes tracked in repository
- No manual Git operations needed

## Best Practices
1. Always preview before saving
2. Use meaningful commit messages
3. Organize media files properly
4. Follow SSOT guidelines

## Cross-References
- See `SECURITY.md` for security guidelines
- See `PLATFORM_FEATURES.md` for feature details
- See `DEVELOPMENT_STATUS.md` for implementation status

## Changelog
- 2025-02-23: Updated with unified CMS access through /tools/cms
- 2025-02-23: Added all CMS tools and their features
- 2025-02-23: Added best practices section
