import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
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
  ],
  server: {
    port: 8001,
    strictPort: true,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8003',
        ws: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime"),
    },
  },
  optimizeDeps: {
    include: [
      'react/jsx-runtime', 
      'react', 
      'react-dom', 
      'react/jsx-dev-runtime',
      'react-dom/client',
      'react-router-dom',
      '@tanstack/react-query'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        focus: path.resolve(__dirname, 'focus.html'),
        sleep: path.resolve(__dirname, 'sleep.html'),
      },
    },
  },
}))
