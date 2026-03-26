import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
// Explicit PostCSS + Tailwind so Storybook and Vite always compile `@tailwind` in `globals.css`.
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.join(__dirname, 'tailwind.config.cjs') }),
        autoprefixer(),
      ],
    },
  },
});
