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

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
  table: {
    getState,
    options: {
      icons: { IconSearch, IconSearchOff },
      localization: { showHideSearch },
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { globalFilter, showGlobalFilter } = getState();

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={title ?? showHideSearch}
          className={clsx('h-9 w-9 text-muted-foreground', rest?.className)}
          disabled={!!globalFilter}
          onClick={handleToggleSearch}
          size="icon"
          variant="ghost"
        >
          {showGlobalFilter ? (
            <IconSearchOff className="size-4" />
          ) : (
            <IconSearch className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title ?? showHideSearch}</TooltipContent>
    </Tooltip>
  );
};
