import clsx from 'clsx';
import { type MouseEvent, useState } from 'react';

import { type RowPinningPosition } from '@tanstack/react-table';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  pinningPosition: RowPinningPosition;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      icons: { IconPinned, IconX },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const isPinned = row.getIsPinned();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    setTooltipOpen(false);
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={localization.pin}
          className={clsx('h-6 w-6 text-muted-foreground', rest?.className)}
          onClick={handleTogglePin}
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          size="icon"
          variant="ghost"
        >
          {isPinned ? (
            <IconX className="size-3.5" />
          ) : (
            <IconPinned
              className="size-3.5"
              style={{
                transform: `rotate(${
                  rowPinningDisplayMode === 'sticky'
                    ? 135
                    : pinningPosition === 'top'
                      ? 180
                      : 0
                }deg)`,
              }}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isPinned ? localization.unpin : localization.pin}
      </TooltipContent>
    </Tooltip>
  );
};
