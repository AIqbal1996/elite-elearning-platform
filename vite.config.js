import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'elite-elearning-platform.onrender.com',
      'elite-elearning-platform-1.onrender.com'
    ]
  }
});