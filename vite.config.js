import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split React and its reconciler/scheduler into their own chunk so the
          // entry bundle stays small and React is cached independently.
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react'
          }
          // All other third-party deps (minisearch, etc.) go to a shared vendor chunk.
          if (id.includes('/node_modules/')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
