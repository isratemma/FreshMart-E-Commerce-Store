import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'vendor-firebase';
          if (id.includes('axios'))    return 'vendor-axios';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
