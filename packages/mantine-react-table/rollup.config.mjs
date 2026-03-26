import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

const tailwindMergeStylesPlugin = () => ({
  name: 'tailwind-merge-styles',
  writeBundle() {
    execSync(
      'pnpm exec tailwindcss -c tailwind.config.cjs -i ./src/globals.css -o ./dist/tw.css',
      { stdio: 'inherit' },
    );
    execSync('node merge-styles.mjs', { stdio: 'inherit' });
  },
});
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    external: [
      '@tabler/icons-react',
      '@tanstack/match-sorter-utils',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'clsx',
      'dayjs',
      'react',
      'react-dom',
    ],
    input: './src/index.ts',
    output: [
      {
        file: `./${pkg.main}`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./${pkg.module}`,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({ browser: true }),
      external(),
      typescript({
        rootDir: './src',
      }),
      postcss({
        extract: true,
        minimize: false,
        modules: true,
      }),
      tailwindMergeStylesPlugin(),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [
      { file: `./dist/index.d.cts`, format: 'cjs' },
      { file: './dist/index.esm.d.mts', format: 'esm' },
    ],
    plugins: [
      copy({
        hook: 'buildStart',
        targets: [
          {
            dest: './',
            rename: 'styles.css',
            src: 'dist/styles-merged.css',
          },
        ],
      }),
      del({
        hook: 'buildEnd',
        targets: [
          'dist/index.css',
          'dist/index.esm.css',
          'dist/tw.css',
          'dist/styles-merged.css',
          'dist/types',
        ],
      }),
      dts(),
    ],
  },
];
