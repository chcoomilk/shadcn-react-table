import clsx from 'clsx';

import { cn } from '../../lib/utils';

import { IconLoader2 } from '@tabler/icons-react';

export function MRT_LoadingOverlay({
  className,
  spinner = true,
  visible,
  zIndex = 2,
  ...props
}: {
  spinner?: boolean;
  visible?: boolean;
  zIndex?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!visible) return null;
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-background/60',
        className,
      )}
      style={{ zIndex }}
      {...props}
    >
      {spinner && <IconLoader2 className={clsx('h-8 w-8 animate-spin text-primary')} />}
    </div>
  );
}
