import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],
  server: {
    port: 8001,
    strictPort: true,
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
}) 