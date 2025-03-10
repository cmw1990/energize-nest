# SSOT Documentation Guidelines

## Overview
This document provides guidelines for maintaining and updating each SSOT (Single Source of Truth) file in the project.

## SSOT Files and Their Purposes

### Platform Documentation
1. **PLATFORM_FEATURES.md**
   - Purpose: Define feature availability across platforms
   - Update Triggers:
     - New feature addition
     - Platform support changes
     - Feature deprecation
   - Required Sections:
     - Platform purposes
     - Feature matrix
     - Platform-specific features
     - Cross-platform features

2. **PLATFORM_STRATEGY.md**
   - Purpose: Define platform-specific implementation strategies
   - Update Triggers:
     - New platform addition
     - Architecture changes
     - Technology stack updates
   - Required Sections:
     - Platform categories
     - Implementation guidelines
     - Technology requirements
     - Best practices

3. **ROUTING_STRATEGY.md**
   - Purpose: Define routing structure across platforms
   - Update Triggers:
     - Route structure changes
     - New platform addition
     - Navigation pattern changes
   - Required Sections:
     - Route naming conventions
     - Platform-specific routes
     - Route configuration
     - Navigation patterns

### Technical Documentation
1. **API.md**
   - Purpose: Document API endpoints and usage
   - Update Triggers:
     - New endpoint addition
     - Endpoint changes
     - Parameter updates
   - Required Sections:
     - Endpoint definitions
     - Request/response formats
     - Authentication requirements
     - Error handling

2. **SECURITY.md**
   - Purpose: Document security protocols
   - Update Triggers:
     - Security policy changes
     - New security features
     - Vulnerability patches
   - Required Sections:
     - Security policies
     - Authentication flows
     - Data protection
     - Compliance requirements

### Development Documentation
1. **STYLE_GUIDE.md**
   - Purpose: Define coding standards
   - Update Triggers:
     - New coding standards
     - Best practice updates
     - Tool configuration changes
   - Required Sections:
     - Code formatting
     - Naming conventions
     - Project structure
     - Testing requirements

2. **DEVELOPMENT_STATUS.md**
   - Purpose: Track implementation progress
   - Update Triggers:
     - Feature completion
     - Bug fixes
     - Sprint updates
   - Required Sections:
     - Feature status
     - Test coverage
     - Dependencies
     - Known issues

## Update Process

### Pre-Edit Checklist
1. Review relevant SSOT files
2. Check for dependencies
3. Verify platform compatibility
4. Review existing documentation

### During Edit
1. Follow file-specific guidelines
2. Maintain consistent formatting
3. Update all affected sections
4. Add change justification

### Post-Edit Requirements
1. Update related SSOT files
2. Update version numbers
3. Add changelog entry
4. Verify cross-references

## File Templates

### Feature Documentation
```markdown
## Feature Name
**Platform Support**: [List platforms]
**Status**: [Status]
**Dependencies**: [List dependencies]

### Description
[Feature description]

### Implementation Details
[Implementation specifics]

### Platform-Specific Notes
[Platform-specific details]
```

### API Documentation
```markdown
## Endpoint: [Method] /path
**Platforms**: [List platforms]
**Authentication**: [Auth requirements]

### Request
[Request format]

### Response
[Response format]

### Examples
[Usage examples]
```

### Status Update
```markdown
## Component: [Name]
**Status**: [Status]
**Last Updated**: [Date]
**Coverage**: [Percentage]

### Changes
[Change details]

### Dependencies
[Dependencies list]
```

## Validation Rules

### Required Elements
1. Clear section headers
2. Platform compatibility
3. Update timestamps
4. Change justification

### Formatting Rules
1. Use markdown formatting
2. Consistent heading levels
3. Code block annotations
4. Table formatting

## Best Practices

1. Keep content focused
2. Use clear examples
3. Include platform context
4. Maintain cross-references
5. Regular updates
6. Version tracking
