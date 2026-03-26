import * as React from 'react';

import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: "indeterminate" | number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full',
        className,
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all bg-primary/20", value === "indeterminate" && "shimmer shimmer-bg shimmer-color-primary shimmer-repeat-delay-750 shimmer-duration-900")}
        style={{ transform: `translateX(-${value === "indeterminate" ? 0 : 100 - (value || 0)}%)` }}
      />
    </div>
  ),
);
Progress.displayName = 'Progress';

export { Progress };
