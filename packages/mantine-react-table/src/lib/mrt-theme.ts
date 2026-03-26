import { useMemo } from 'react';

/**
 * Minimal theme shape compatible with callbacks that previously received Mantine `theme`.
 * Consumers using `mantine*Props.style={(theme) => ...}` should migrate to CSS variables;
 * this stub may not match Mantine's full color palette.
 */
export type MRT_CompatibleTheme = {
  colors: Record<string, string[]>;
  primaryColor: string;
  primaryShade: number | { dark: number; light: number };
};

const defaultPalette = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
];

export function useMRTCompatibleTheme(): MRT_CompatibleTheme {
  return useMemo(
    () => ({
      colors: {
        blue: defaultPalette,
        cyan: defaultPalette,
        dark: defaultPalette,
        grape: defaultPalette,
        gray: defaultPalette,
        green: defaultPalette,
        indigo: defaultPalette,
        lime: defaultPalette,
        orange: defaultPalette,
        pink: defaultPalette,
        primary: defaultPalette,
        red: defaultPalette,
        teal: defaultPalette,
        violet: defaultPalette,
        yellow: defaultPalette,
      },
      primaryColor: 'primary',
      primaryShade: 6,
    }),
    [],
  );
}
