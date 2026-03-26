import { colord } from 'colord';

import { type MRT_CompatibleTheme } from '../lib/mrt-theme';
import { type MantineShade } from '../types';

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export const getPrimaryShade = (theme: MRT_CompatibleTheme): number =>
  typeof theme.primaryShade === 'number'
    ? theme.primaryShade
    : (theme.primaryShade?.dark ?? 7);

export const getPrimaryColor = (
  theme: MRT_CompatibleTheme,
  shade?: MantineShade,
): string =>
  theme.colors[theme.primaryColor]?.[shade ?? getPrimaryShade(theme)] ??
  'hsl(var(--primary))';

/** Stripe hover: adjust a CSS color string (hex/rgb/hsl). */
export function adjustStripeHoverColor(
  base: string | undefined,
  colorScheme: 'dark' | 'light',
): string | undefined {
  if (!base) return undefined;
  const c = colord(base);
  if (!c.isValid()) return undefined;
  return colorScheme === 'dark'
    ? c.lighten(0.08).toHex()
    : c.darken(0.12).toHex();
}

export function dataVariable(
  name: string,
  value: boolean | number | string | undefined,
) {
  const key = `data-${name}`;
  switch (typeof value) {
    case 'boolean':
      return value ? { [key]: '' } : null;
    case 'number':
      return { [key]: `${value}` };
    case 'string':
      return { [key]: value };
    default:
      return null;
  }
}
