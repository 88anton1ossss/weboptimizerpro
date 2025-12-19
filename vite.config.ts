import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Use the env var if available, otherwise set to empty string to allow build to pass.
      // The API key MUST be present in the runtime environment or build arguments.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});