import clsx from 'clsx';
import { type MouseEvent } from 'react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  handleEdit: (event: MouseEvent) => void;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_RowActionMenu = <TData extends MRT_RowData>({
  handleEdit,
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      editDisplayMode,
      enableEditing,
      icons: { IconDots, IconEdit },
      localization,
      positionActionsColumn,
      renderRowActionMenuItems,
    },
  } = table;

  const align =
    positionActionsColumn === 'first'
      ? 'start'
      : positionActionsColumn === 'last'
        ? 'end'
        : 'center';

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={localization.rowActions}
              onClick={(event) => event.stopPropagation()}
              size="icon"
              variant="ghost"
              {...rest}
              className={clsx("h-8 w-8 text-muted-foreground", rest?.className)}
            >
              <IconDots className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">{localization.rowActions}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align={align} onClick={(event) => event.stopPropagation()} side="bottom">
        {enableEditing && editDisplayMode !== 'table' && (
          <DropdownMenuItem
            onSelect={() =>
              handleEdit({ stopPropagation: () => {} } as MouseEvent)
            }
          >
            <span className="flex items-center gap-2">
              <IconEdit className="size-4 shrink-0" />
              {localization.edit}
            </span>
          </DropdownMenuItem>
        )}
        {renderRowActionMenuItems?.({
          row,
          table,
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
