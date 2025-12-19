import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Vercel injects environment variables into process.env during build.
  // We check both the loaded .env object and the actual process.env to be safe.
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Use the env var if available, otherwise set to empty string.
      // The API key MUST be present in the Vercel Project Settings for this to work.
      'process.env.API_KEY': JSON.stringify(apiKey || '')
    }
  };
});