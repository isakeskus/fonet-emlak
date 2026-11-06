import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Geliştirmede /api istekleri Spring Boot'a (8080) yönlendirilir.
// Derleme çıktısı Spring Boot'un static klasörüne yazılır; tek paket olarak sunulur.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
