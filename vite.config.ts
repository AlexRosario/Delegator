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
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/5Calls': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/congressGov': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/positionStack': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
