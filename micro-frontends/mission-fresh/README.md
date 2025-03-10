# Mission Fresh Micro-Frontend

This is a standalone micro-frontend for the Mission Fresh application. It can be developed and deployed independently, or integrated into a host application.

## Features

- Dashboard for business overview
- Product management
- Order processing
- Analytics and reporting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:9002

## Development

### Project Structure

```
src/
├── components/       # UI components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── MissionFreshApp.tsx  # Main application component
├── bootstrap.tsx     # Bootstrap for mounting in host app
├── index.ts          # Public API
└── main.tsx          # Entry point for standalone mode
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Integration with Host Application

### Using Module Federation

This micro-frontend is configured with Module Federation. You can import it in your host application like this:

```javascript
// In your host application's webpack/vite config
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        missionFresh: 'http://localhost:9002/assets/remoteEntry.js',
      },
    }),
  ],
});

// In your host application's code
import { mount } from 'missionFresh/App';

// Mount the micro-frontend
mount(document.getElementById('mission-fresh-container'), {
  basePath: '/mission-fresh',
  session: userSession,
  supabaseClient: supabaseClient,
});
```

### Direct Component Import

You can also import individual components:

```javascript
import { Dashboard, ProductList } from 'missionFresh/App';

// Use components directly
<Dashboard session={userSession} supabaseClient={supabaseClient} />
```

## Code Sharing Rules

This micro-frontend follows strict code sharing rules to maintain independence while enabling collaboration:

1. **Read-Only Access**: Other micro-frontends can import and use components from Mission Fresh, but cannot modify them.

2. **Public API Only**: Only components and types explicitly exported in `src/index.ts` are available for import by other micro-frontends.

3. **How to Import**:
   ```javascript
   // Correct way to import from Mission Fresh
   import { MissionFreshLayout } from 'missionFresh/App';
   
   // Using an exported component
   <MissionFreshLayout session={userSession} />
   ```

4. **Extending Functionality**: If you need to extend or modify a component, create a wrapper component in your own micro-frontend rather than modifying the original.

5. **Contributing Changes**: To suggest changes to this micro-frontend, please submit a pull request to its dedicated repository rather than modifying it directly within your project.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

This project is licensed under the MIT License. 