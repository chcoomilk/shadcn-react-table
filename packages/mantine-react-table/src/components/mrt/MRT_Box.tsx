import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

import type { BoxProps } from '../../types/mrt-ui-props';
import { mergeCssVars } from '../../utils/mrt-style';

/**
 * Replaces Mantine `Box` — layout div with optional `__vars` (CSS custom properties).
 */
export const MRT_Box = forwardRef<
  HTMLDivElement,
  BoxProps & HTMLAttributes<HTMLDivElement>
>(function MRT_Box({ className, style, __vars, ...props }, ref) {
  return (
    <div
      className={clsx(className)}
      ref={ref}
      style={{
        ...mergeCssVars(__vars),
        ...(style && typeof style === 'object' ? style : {}),
      }}
      {...props}
    />
  );
});
