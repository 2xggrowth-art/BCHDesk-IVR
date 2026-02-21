import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_APP_ROLE': JSON.stringify(process.env.VITE_APP_ROLE || 'all'),
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: process.env.VITE_APP_ROLE ? `dist/${process.env.VITE_APP_ROLE}` : 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          state: ['zustand'],
        },
      },
    },
  },
});
