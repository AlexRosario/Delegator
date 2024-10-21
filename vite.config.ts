import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env.local') });

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  server: {
    proxy: {
      '/congressGov': {
        target: 'https://api.congress.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/congressGov/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const apiKey = process.env.VITE_API_KEY; // Check if process.env has access to the key
            if (apiKey) {
              proxyReq.setHeader('X-Api-Key', apiKey);
            } else {
              console.warn('API Key is not set in the environment variables.');
            }
          });
        }
      }
    }
  }
});
