import type { CSSProperties } from 'react';

import { type MRT_CompatibleTheme } from '../lib/mrt-theme';

export function resolveThemeStyle(
  style:
    | CSSProperties
    | ((theme: MRT_CompatibleTheme) => CSSProperties)
    | undefined,
  theme: MRT_CompatibleTheme,
): CSSProperties | undefined {
  if (!style) return undefined;
  return typeof style === 'function' ? style(theme) : style;
}

export function mergeCssVars(
  vars?: Record<string, string | number | undefined>,
): CSSProperties | undefined {
  if (!vars) return undefined;
  return vars as CSSProperties;
}
