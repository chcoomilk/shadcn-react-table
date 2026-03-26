import clsx from 'clsx';

import classes from './MRT_ColumnPinningButtons.module.css';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData> {
  column: MRT_Column<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  table,
}: Props<TData>) => {
  const {
    options: {
      icons: { IconPinned, IconPinnedOff },
      localization,
    },
  } = table;
  return (
    <div className={clsx('mrt-column-pinning-buttons flex gap-0.5', classes.root)}>
      {column.getIsPinned() ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 text-muted-foreground"
              onClick={() => column.pin(false)}
              size="icon"
              variant="ghost"
            >
              <IconPinnedOff className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{localization.unpin}</TooltipContent>
        </Tooltip>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 text-muted-foreground"
                onClick={() => column.pin('left')}
                size="icon"
                variant="ghost"
              >
                <IconPinned className={clsx('size-4', classes.left)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{localization.pinToLeft}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 text-muted-foreground"
                onClick={() => column.pin('right')}
                size="icon"
                variant="ghost"
              >
                <IconPinned className={clsx('size-4', classes.right)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{localization.pinToRight}</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};
