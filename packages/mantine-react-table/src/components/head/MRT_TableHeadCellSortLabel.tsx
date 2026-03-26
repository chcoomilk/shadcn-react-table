import clsx from 'clsx';

import classes from './MRT_TableHeadCellSortLabel.module.css';

import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types';
import { type ActionIconProps } from '../../types/mrt-ui-props';
import { dataVariable } from '../../utils/style.utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { TooltipPortal } from '@radix-ui/react-tooltip';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellSortLabel = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      icons: { IconArrowsSort, IconSortAscending, IconSortDescending },
      localization,
    },
  } = table;
  const column = header.column;
  const { columnDef } = column;
  const { sorting } = getState();
  const sorted = column.getIsSorted();
  const sortIndex = column.getSortIndex();

  const sortTooltip = sorted
    ? sorted === 'desc'
      ? localization.sortedByColumnDesc.replace('{column}', String(columnDef.header))
      : localization.sortedByColumnAsc.replace('{column}', String(columnDef.header))
    : column.getNextSortingOrder() === 'desc'
      ? localization.sortByColumnDesc.replace('{column}', String(columnDef.header))
      : localization.sortByColumnAsc.replace('{column}', String(columnDef.header));

  const SortActionButton = (
    <Button
      aria-label={sortTooltip}
      size="icon"
      variant="ghost"
      {...dataVariable('sorted', sorted)}
      {...rest}
      className={clsx(
        'mrt-table-head-sort-button h-8 w-8 text-muted-foreground',
        classes['sort-icon'],
        rest?.className,
      )}
    >
      {sorted === 'desc' ? (
        <IconSortDescending className="size-4" />
      ) : sorted === 'asc' ? (
        <IconSortAscending className="size-4" />
      ) : (
        <IconArrowsSort className="size-4" />
      )}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {sorting.length < 2 || sortIndex === -1 ? (
          SortActionButton
        ) : (
          <span
            className={clsx(
              'relative inline-flex',
              'mrt-table-head-multi-sort-indicator',
              classes['multi-sort-indicator'],
            )}
          >
            {SortActionButton}
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-medium text-primary-foreground">
              {sortIndex + 1}
            </span>
          </span>
        )}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className='z-10' side="bottom">{sortTooltip}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
