import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin(), svgr()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001', // 后端API服务器地址
          changeOrigin: true, // 是否改变域名
          rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
        },
      },
    }
  };
});
