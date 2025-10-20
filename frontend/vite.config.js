import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:5000',
                    changeOrigin: true,
                },
            },
        },
    };
});
