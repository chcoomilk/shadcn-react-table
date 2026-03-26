import clsx from 'clsx';

import classes from './MRT_ColumnActionMenu.module.css';

import type { ComponentPropsWithoutRef } from 'react';

import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { TooltipPortal } from '@radix-ui/react-tooltip';

interface Props<TData extends MRT_RowData>
  extends Omit<
    ComponentPropsWithoutRef<typeof DropdownMenuContent>,
    'children' | 'onChange'
  > {
  header: MRT_Header<TData>;
  /** Mantine Menu `onChange` — maps to Radix `onOpenChange` */
  onChange?: (opened: boolean) => void;
  /** Mantine Menu `opened` — maps to Radix `open` */
  opened?: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_ColumnActionMenu = <TData extends MRT_RowData>({
  header,
  onChange,
  opened,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        IconArrowAutofitContent,
        IconBoxMultiple,
        IconClearAll,
        IconColumns,
        IconDotsVertical,
        IconEyeOff,
        IconFilter,
        IconFilterOff,
        IconPinned,
        IconPinnedOff,
        IconSortAscending,
        IconSortDescending,
      },
      localization,
      mantineColumnActionsButtonProps,
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnOrder,
    setColumnSizingInfo,
    setShowColumnFilters,
    toggleAllColumnsVisible,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { columnSizing, columnVisibility } = getState();

  const arg = { column, table };
  const actionIconProps = {
    ...parseFromValuesOrFunc(mantineColumnActionsButtonProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineColumnActionsButtonProps, arg),
  };

  const handleClearSort = () => {
    column.clearSorting();
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
  };

  const handleResetColumnSize = () => {
    setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old: any) => ['mrt-row-expand', ...old]);
  };

  const handleClearFilter = () => {
    column.setFilterValue('');
  };

  const handleFilterByColumn = () => {
    setShowColumnFilters(true);
    setTimeout(() => filterInputRefs.current[`${column.id}-0`]?.focus(), 100);
  };

  const handleShowAllColumns = () => {
    toggleAllColumnsVisible(true);
  };

  const internalColumnMenuItems = (
    <>
      {enableSorting && column.getCanSort() && (
        <>
          {enableSortingRemoval !== false && (
            <DropdownMenuItem
              disabled={!column.getIsSorted()}
              onSelect={() => handleClearSort()}
            >
              <span className="flex items-center gap-2">
                <IconClearAll className="size-4 shrink-0" />
                {localization.clearSort}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={column.getIsSorted() === 'asc'}
            onSelect={() => handleSortAsc()}
          >
            <span className="flex items-center gap-2">
              <IconSortAscending className="size-4 shrink-0" />
              {localization.sortByColumnAsc?.replace(
                '{column}',
                String(columnDef.header),
              )}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={column.getIsSorted() === 'desc'}
            onSelect={() => handleSortDesc()}
          >
            <span className="flex items-center gap-2">
              <IconSortDescending className="size-4 shrink-0" />
              {localization.sortByColumnDesc?.replace(
                '{column}',
                String(columnDef.header),
              )}
            </span>
          </DropdownMenuItem>
          {(enableColumnFilters || enableGrouping || enableHiding) && (
            <DropdownMenuSeparator key={3} />
          )}
        </>
      )}
      {enableColumnFilters &&
        columnFilterDisplayMode !== 'popover' &&
        column.getCanFilter() && (
          <>
            <DropdownMenuItem
              disabled={!column.getFilterValue()}
              onSelect={() => handleClearFilter()}
            >
              <span className="flex items-center gap-2">
                <IconFilterOff className="size-4 shrink-0" />
                {localization.clearFilter}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterByColumn()}>
              <span className="flex items-center gap-2">
                <IconFilter className="size-4 shrink-0" />
                {localization.filterByColumn?.replace(
                  '{column}',
                  String(columnDef.header),
                )}
              </span>
            </DropdownMenuItem>
            {(enableGrouping || enableHiding) && <DropdownMenuSeparator key={2} />}
          </>
        )}
      {enableGrouping && column.getCanGroup() && (
        <>
          <DropdownMenuItem onSelect={() => handleGroupByColumn()}>
            <span className="flex items-center gap-2">
              <IconBoxMultiple className="size-4 shrink-0" />
              {
                localization[
                  column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
                ]?.replace('{column}', String(columnDef.header))
              }
            </span>
          </DropdownMenuItem>
          {enableColumnPinning && <DropdownMenuSeparator />}
        </>
      )}
      {enableColumnPinning && column.getCanPin() && (
        <>
          <DropdownMenuItem
            disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
            onSelect={() => handlePinColumn('left')}
          >
            <span className="flex items-center gap-2">
              <IconPinned className={classes.left + ' size-4 shrink-0'} />
              {localization.pinToLeft}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
            onSelect={() => handlePinColumn('right')}
          >
            <span className="flex items-center gap-2">
              <IconPinned className={classes.right + ' size-4 shrink-0'} />
              {localization.pinToRight}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!column.getIsPinned()}
            onSelect={() => handlePinColumn(false)}
          >
            <span className="flex items-center gap-2">
              <IconPinnedOff className="size-4 shrink-0" />
              {localization.unpin}
            </span>
          </DropdownMenuItem>
          {enableHiding && <DropdownMenuSeparator />}
        </>
      )}
      {enableColumnResizing && column.getCanResize() && (
        <DropdownMenuItem
          disabled={!columnSizing[column.id]}
          key={0}
          onSelect={() => handleResetColumnSize()}
        >
          <span className="flex items-center gap-2">
            <IconArrowAutofitContent className="size-4 shrink-0" />
            {localization.resetColumnSize}
          </span>
        </DropdownMenuItem>
      )}
      {enableHiding && (
        <>
          <DropdownMenuItem
            disabled={!column.getCanHide()}
            key={0}
            onSelect={() => handleHideColumn()}
          >
            <span className="flex items-center gap-2">
              <IconEyeOff className="size-4 shrink-0" />
              {localization.hideColumn?.replace(
                '{column}',
                String(columnDef.header),
              )}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            key={1}
            onSelect={() => handleShowAllColumns()}
          >
            <span className="flex items-center gap-2">
              <IconColumns className="size-4 shrink-0" />
              {localization.showAllColumns?.replace(
                '{column}',
                String(columnDef.header),
              )}
            </span>
          </DropdownMenuItem>
        </>
      )}
    </>
  );

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={onChange}
      open={opened}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={localization.columnActions}
              size="icon"
              variant="ghost"
              {...actionIconProps}
              className={clsx("h-8 w-8 text-muted-foreground", actionIconProps?.className)}
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom">
            {actionIconProps?.title ?? localization.columnActions}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <DropdownMenuContent align="start" side="bottom" {...rest}>
        {columnDef.renderColumnActionsMenuItems?.({
          column,
          internalColumnMenuItems,
          table,
        }) ??
          renderColumnActionsMenuItems?.({
            column,
            internalColumnMenuItems,
            table,
          }) ??
          internalColumnMenuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
