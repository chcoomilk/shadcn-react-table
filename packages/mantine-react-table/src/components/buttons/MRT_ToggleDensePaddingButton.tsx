import clsx from 'clsx';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type HTMLPropsRef,
  type MRT_DensityState,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData>
  extends ActionIconProps,
    HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>;
}

type TogglableDensityState = Exclude<MRT_DensityState, 'lg' | 'sm'>;

const next: Record<TogglableDensityState, TogglableDensityState> = {
  md: 'xs',
  xl: 'md',
  xs: 'xl',
};

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
  table: {
    getState,
    options: {
      icons: {
        IconBaselineDensityLarge,
        IconBaselineDensityMedium,
        IconBaselineDensitySmall,
      },
      localization: { toggleDensity },
    },
    setDensity,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { density } = getState();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={title ?? toggleDensity}
          className={clsx('h-9 w-9 text-muted-foreground', rest?.className)}
          onClick={() =>
            setDensity((current) => next[current as TogglableDensityState])
          }
          size="icon"
          variant="ghost"
        >
          {density === 'xs' ? (
            <IconBaselineDensitySmall className="size-4" />
          ) : density === 'md' ? (
            <IconBaselineDensityMedium className="size-4" />
          ) : (
            <IconBaselineDensityLarge className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title ?? toggleDensity}</TooltipContent>
    </Tooltip>
  );
};
