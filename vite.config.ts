import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        rewrite: (path) => {
          const newPath = path.replace(/^\/congressGov/, '');
          console.log(`Rewriting path from ${path} to ${newPath}`);
          return newPath;
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`Proxying request to: ${proxyReq.path}`);
            // Use environment variable instead of hardcoded key
            const apiKey = process.env.VITE_API_KEY;
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
