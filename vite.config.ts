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
            const apiKey = process.env.API_KEY;
            if (apiKey) {
              proxyReq.setHeader('X-Api-Key', apiKey);
            } else {
              console.warn('API Key is not set in the environment variables.');
            }
          });
        }
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/fiveCalls': {
        target: 'https://api.5calls.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fiveCalls/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const apiKey = process.env.FIVECALLS_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('X-5Calls-Token', `${apiKey}`);
            } else {
              console.warn(
                '5Calls API Key is not set in the environment variables.'
              );
            }
          });
        }
      },
      '/positionStack': {
        target: 'http://api.positionstack.com/v1',
        changeOrigin: true,
        rewrite: (path) => {
          const key = process.env.POSITIONSTACK_API_KEY;
          const rewritten = path.replace(/^\/positionStack/, '');
          return `${rewritten}${rewritten.includes('?') ? '&' : '?'}access_key=${key}`;
        }
      }
    }
  }
});
