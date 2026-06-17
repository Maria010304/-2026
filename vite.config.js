import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // host: true — слушаем все сетевые интерфейсы, чтобы dev-сервер
    // был доступен не только по localhost, но и по локальному IP
    // (нужно для тестирования с телефона по Wi-Fi).
    host: true,
    open: true,
  },
});
