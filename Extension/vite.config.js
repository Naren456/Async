import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ 
      manifest,
      // Don't bundle the background script
      contentScripts: {
        injectCss: true,
      },
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'popup.html'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  }
});
