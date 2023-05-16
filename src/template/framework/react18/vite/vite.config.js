import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';


export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      cors: true,
      host: '0.0.0.0',
      port: 8080,
      proxy: {},
    },
  };
});
