import clsx from 'clsx';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type HTMLPropsRef,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData>
  extends ActionIconProps,
    HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFiltersButton = <TData extends MRT_RowData>({
  table: {
    getState,
    options: {
      icons: { IconFilter, IconFilterOff },
      localization: { showHideFilters },
    },
    setShowColumnFilters,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { showColumnFilters } = getState();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={title ?? showHideFilters}
          className={clsx('h-9 w-9 text-muted-foreground', rest?.className)}
          onClick={() => setShowColumnFilters((current) => !current)}
          size="icon"
          variant="ghost"
        >
          {showColumnFilters ? (
            <IconFilterOff className="size-4" />
          ) : (
            <IconFilter className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title ?? showHideFilters}</TooltipContent>
    </Tooltip>
  );
};
