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
            proxyReq.setHeader(
              'X-Api-Key',
              'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3'
            );
          });
        }
      }
    }
  }
});
