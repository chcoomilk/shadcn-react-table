import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const tailwindPath = new URL('./dist/tw.css', import.meta.url);
const modulesPath = new URL('./dist/index.css', import.meta.url);
const outPath = new URL('./dist/styles-merged.css', import.meta.url);

const tw = readFileSync(tailwindPath);
const mod = existsSync(modulesPath) ? readFileSync(modulesPath) : Buffer.alloc(0);
writeFileSync(outPath, Buffer.concat([tw, Buffer.from('\n'), mod]));
