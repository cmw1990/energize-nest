# Test Environment

## Overview

The Well-Charged platform implements parallel test environments alongside the production environment to facilitate safe development, testing, and validation of new features without affecting the live user experience.

## Test Versions

### WebApp Test Version (`/webapp2/*`)

The WebApp platform has a dedicated test environment accessible via the `/webapp2/` route prefix that mirrors the production environment's structure.

#### Purpose

- Develop and test new features in isolation without affecting the production environment
- Conduct A/B testing of UI/UX changes
- Validate functionality before promoting to the production environment
- Troubleshoot issues in a controlled environment
- Allow for side-by-side comparison with the production environment

#### Implementation

The test version is implemented as a parallel route structure in the application router:

```typescript
// Production Environment
<Route path="/webapp" element={<WebAppLayout />}>
  <Route path="dashboard" element={<WebappDashboard />} />
  <Route path="focus/white-noise" element={<WhiteNoiseComponent />} />
  // Other routes...
</Route>

// Test Environment
<Route path="/webapp2" element={<WebAppLayout />}>
  <Route path="dashboard" element={<WebappDashboard />} />
  <Route path="focus/white-noise" element={<WhiteNoiseComponent />} />
  // Other routes...
</Route>
```

#### Access

The test environment can be accessed by changing the URL path from `/webapp/` to `/webapp2/`:

| Production Environment | Test Environment |
|------------------------|------------------|
| `/webapp/dashboard` | `/webapp2/dashboard` |
| `/webapp/focus/white-noise` | `/webapp2/focus/white-noise` |
| `/webapp/focus/timer` | `/webapp2/focus/timer` |

#### Data Persistence

Both environments interact with the same database but use separate tables (with appropriate SSOT version identifiers) to ensure data isolation and prevent cross-contamination.

#### Guidelines for Use

1. **Always develop new features in the test environment first**
   - Create and validate functionality in `/webapp2/*` before deploying to production
   - Use the test environment for all experimental features

2. **Test environment access**
   - Use the same login credentials as the production environment
   - The test environment maintains identical authentication flows

3. **Testing protocol**
   - Thoroughly test all new features in the test environment
   - Use the demo account (hertzofhopes@gmail.com) for testing
   - Ensure all data interactions follow the SSOT guidelines with version identifiers

4. **Deployment workflow**
   - Develop in the test environment
   - Validate functionality
   - Promote to production after proper review

## Mobile and Desktop Test Environments

Similar test environments exist for other platforms:

| Platform | Production Environment | Test Environment |
|----------|------------------------|------------------|
| WebApp | `/webapp/*` | `/webapp2/*` |
| MobileApp | `/mobileapp/*` | `/mobileapp2/*` *(planned)* |
| PCApp | `/pcapp/*` | `/pcapp2/*` *(planned)* |
| Extension | `/ext/*` | `/ext2/*` *(planned)* |

## Technical Implementation

The test environments are implemented directly in the routing configuration and share the same components with the production environment. This ensures code reuse and maintains consistency between environments while allowing for isolated testing. 