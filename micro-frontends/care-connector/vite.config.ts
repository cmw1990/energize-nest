import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              throwIfNamespace: false,
              runtime: 'automatic',
              importSource: 'react',
            },
          ],
        ],
      },
    }),
    federation({
      name: 'careConnector',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/components/Dashboard.tsx',
        './Settings': './src/components/Settings.tsx',
        './Groups': './src/components/CareGroups.tsx',
        './GroupDetail': './src/components/GroupDetail.tsx',
        './Tasks': './src/components/TaskManager.tsx',
        './Marketplace': './src/components/Marketplace.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 4009,
    strictPort: true,
    cors: true,
    host: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      'react/jsx-runtime', 
      'react', 
      'react-dom', 
      'react/jsx-dev-runtime',
      'react-dom/client',
      'react-router-dom',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      loader: {
        '.js': 'jsx',
      }
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
}) 