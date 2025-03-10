# Documentation Structure

## Overview
This document outlines the comprehensive documentation structure for Well-Charged, designed to support multiple developers and maintain a single source of truth.

## Single Source of Truth (SSOT) Structure

All project documentation is now consolidated in the `/docs/ssot` directory. This is the ONLY location for project documentation.

### Directory Structure

```
/docs/ssot/
├── DOCUMENTATION_STRUCTURE.md   # This file - Overview of documentation structure
├── NAVIGATION_PATTERNS.md       # Navigation and routing patterns
├── PLATFORM_STRATEGY.md         # Platform architecture and strategy
├── ROUTING_STRATEGY.md          # Routing implementation details
├── SSOT_ADOPTION_GUIDE.md      # Guide for maintaining SSOT
├── SSOT_GUIDELINES.md          # SSOT maintenance guidelines
├── SSOT_SUMMARY.md             # High-level SSOT overview
│
├── development/                 # Development-related documentation
│   ├── DEVELOPMENT_STATUS.md   # Current development status
│   └── STYLE_GUIDE.md         # Coding style guidelines
│
├── features/                    # Feature documentation
│   └── FEATURES.md            # Feature specifications
│
├── overview/                    # Project overview
│   ├── APP_SUMMARY.md         # Application summary
│   ├── ARCHITECTURE.md        # System architecture
│   ├── PROJECT.md             # Project overview
│   └── ROUTING.md             # Routing overview
│
├── platform/                    # Platform-specific documentation
│   ├── PLATFORM_FEATURES.md   # Platform features
│   └── ROUTING_STRATEGY.md    # Platform routing
│
└── technical/                   # Technical documentation
    ├── API.md                 # API documentation
    ├── CMS_INTEGRATION_GUIDE.md # CMS integration
    ├── CMS_TOOLS.md           # CMS tools
    ├── CMS_USAGE_GUIDE.md     # CMS usage
    ├── EDGE_FUNCTIONS.md      # Edge functions
    ├── SECURITY.md            # Security guidelines
    ├── SUPABASE.md            # Supabase configuration
    └── SUPABASE_MCP.md        # Supabase MCP integration

```

### Documentation Guidelines

1. Single Source:
   - ALL documentation MUST be in the `/docs/ssot` directory
   - NO documentation should exist outside this directory
   - The root `README.md` only points to this directory

2. File Organization:
   - Use appropriate subdirectories for categorization
   - Keep related documentation together
   - Use clear, descriptive file names

3. Cross-References:
   - Use relative links between documents
   - Keep references up to date
   - Document relationships between files

4. Maintenance:
   - Regular updates required
   - Remove outdated information
   - Keep structure clean and organized

### Important Notes

1. No Duplicate Documentation:
   - If you find documentation outside `/docs/ssot`, move it here
   - Update any references to old documentation locations
   - Maintain single source of truth

2. Documentation Updates:
   - All changes must be documented
   - Keep changelogs current
   - Review and update regularly

3. New Documentation:
   - Always add to appropriate `/docs/ssot` subdirectory
   - Follow existing naming conventions
   - Update this structure document if needed

## Documentation Standards

### 1. File Naming
- Use UPPERCASE for documentation files
- Use snake_case for directories
- Always include .md extension

### 2. Content Structure
Each documentation file should follow this structure:
```markdown
# Title

## Overview
Brief description of the document's purpose

## Content Sections
Main content organized in sections

## Related Documents
Links to related documentation

## Change Log
Record of significant changes
```

### 3. Maintenance Guidelines

#### Regular Updates
- Review documentation monthly
- Update on significant changes
- Archive outdated content

#### Version Control
- Document version in change log
- Link to relevant PRs
- Track documentation debt

#### Quality Checks
- Technical accuracy
- Completeness
- Up-to-date status
- Link validity

### 4. Documentation Types

#### Conceptual Documentation
- System architecture
- Design principles
- Feature descriptions

#### Technical Documentation
- API references
- Code examples
- Configuration guides

#### Procedural Documentation
- Setup guides
- Workflows
- Troubleshooting

#### Reference Documentation
- API endpoints
- Configuration options
- Environment variables

### 5. Documentation Tools

#### Markdown Features
- Code blocks with syntax highlighting
- Tables for structured data
- Diagrams using Mermaid
- Task lists for todos

#### Integration
- IDE integration
- CI/CD pipeline checks
- Automated updates

### 6. Best Practices

#### Writing Style
- Clear and concise
- Active voice
- Present tense
- Code examples

#### Organization
- Logical hierarchy
- Consistent structure
- Clear navigation

#### Maintenance
- Regular reviews
- Version control
- Automated checks

### 7. Documentation Process

#### Creation
1. Identify documentation need
2. Create outline
3. Write content
4. Review and edit
5. Publish

#### Updates
1. Monitor for changes
2. Update affected docs
3. Review changes
4. Update version
5. Notify team

#### Archival
1. Identify outdated content
2. Archive or update
3. Update references
4. Notify team

### 8. Roles and Responsibilities

#### Documentation Owner
- Maintains structure
- Reviews changes
- Ensures quality

#### Contributors
- Create content
- Update docs
- Report issues

#### Reviewers
- Technical accuracy
- Completeness
- Style consistency

### 9. Quality Metrics

#### Accuracy
- Technical correctness
- Current information
- Valid references

#### Completeness
- All features covered
- All procedures documented
- All edge cases addressed

#### Usability
- Clear structure
- Easy navigation
- Searchable content
