import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/securvotepro/', // Set the base path for the app if it's hosted on a subdirectory
});
