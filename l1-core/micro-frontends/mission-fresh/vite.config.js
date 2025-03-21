import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => ({
  base: '/',
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
      name: 'missionFresh',
      filename: 'remoteEntry.js',
      exposes: {
        './MissionFreshApp': './src/MissionFreshApp',
        './Dashboard': './src/components/Dashboard',
        './Progress': './src/components/Progress',
        './Settings': './src/components/Settings',
        './Community': './src/components/Community',
        './GuidesHub': './src/components/GuidesHub',
        './WebTools': './src/components/WebTools',
        './NRTDirectory': './src/components/NRTDirectory',
        './AlternativeProducts': './src/components/AlternativeProducts',
        './ConsumptionLogger': './src/components/ConsumptionLogger',
        './LandingPage': './src/components/LandingPage',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
    host: true
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
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})) 