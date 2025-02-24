import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
    },
  },
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}))
