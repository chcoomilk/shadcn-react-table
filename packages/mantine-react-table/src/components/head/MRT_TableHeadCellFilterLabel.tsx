import clsx from 'clsx';

import classes from './MRT_TableHeadCellFilterLabel.module.css';

import { type MouseEvent, useState } from 'react';

import { localizedFilterOption } from '../../fns/filterFns';
import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { dataVariable } from '../../utils/style.utils';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellFilterLabel = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      icons: { IconFilter },
      localization,
    },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const filterValue = column.getFilterValue();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const isFilterActive =
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
    (!!filterValue && !Array.isArray(filterValue));

  const isRangeFilter =
    columnDef.filterVariant === 'range' ||
    columnDef.filterVariant === 'date-range' ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(
      columnDef._filterFn,
    );
  const currentFilterOption = columnDef._filterFn;
  const filterValueFn =
    columnDef.filterTooltipValueFn || ((value) => value as string);
  type FilterValueType = Parameters<typeof filterValueFn>[0];
  const filterTooltip =
    columnFilterDisplayMode === 'popover' && !isFilterActive
      ? localization.filterByColumn?.replace(
          '{column}',
          String(columnDef.header),
        )
      : localization.filteringByColumn
          .replace('{column}', String(columnDef.header))
          .replace(
            '{filterType}',
            localizedFilterOption(localization, currentFilterOption),
          )
          .replace(
            '{filterValue}',
            `"${
              Array.isArray(column.getFilterValue())
                ? (
                    column.getFilterValue() as [
                      FilterValueType,
                      FilterValueType,
                    ]
                  )
                    .map((v) => filterValueFn(v))
                    .join(
                      `" ${isRangeFilter ? localization.and : localization.or} "`,
                    )
                : filterValueFn(column.getFilterValue())
            }"`,
          )
          .replace('" "', '');

  const showFilterIcon =
    columnFilterDisplayMode === 'popover' ||
    (!!column.getFilterValue() && !isRangeFilter) ||
    (isRangeFilter &&
      (!!(column.getFilterValue() as [unknown, unknown])?.[0] ||
        !!(column.getFilterValue() as [unknown, unknown])?.[1]));

  if (!showFilterIcon) {
    return null;
  }

  const triggerButton = (
    <Button
      aria-label={filterTooltip}
      {...dataVariable('active', isFilterActive)}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (columnFilterDisplayMode === 'popover') {
          setPopoverOpen((o) => !o);
        } else {
          setShowColumnFilters(true);
        }
        setTimeout(() => {
          const input = filterInputRefs.current[`${column.id}-0`];
          input?.focus();
          input?.select();
        }, 100);
      }}
      size="icon"
      variant="ghost"
      {...rest}
      className={clsx(
        'mrt-table-head-cell-filter-label-icon h-[18px] w-[18px] min-w-[18px] text-muted-foreground',
        classes.root,
        rest?.className,
      )}
    >
      <IconFilter className="size-[18px]" />
    </Button>
  );

  if (columnFilterDisplayMode === 'popover') {
    return (
      <Popover
        modal={columnDef.filterVariant !== 'range-slider'}
        onOpenChange={setPopoverOpen}
        open={popoverOpen}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          </TooltipTrigger>
          {!popoverOpen ? (
            <TooltipContent
              className={filterTooltip.length > 40 ? 'max-w-[300px]' : undefined}
              side="top"
            >
              {filterTooltip}
            </TooltipContent>
          ) : null}
        </Tooltip>
        <PopoverContent
          align="center"
          className="w-[360px] p-3 shadow-xl"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) =>
            event.key === 'Enter' && setPopoverOpen(false)
          }
          onMouseDown={(event) => event.stopPropagation()}
          side="top"
        >
          <MRT_TableHeadCellFilterContainer header={header} table={table} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
      <TooltipContent
        className={filterTooltip.length > 40 ? 'max-w-[300px]' : undefined}
        side="top"
      >
        {filterTooltip}
      </TooltipContent>
    </Tooltip>
  );
};
