import clsx from 'clsx';

import classes from './MRT_TableHeadCellFilterContainer.module.css';

import { type FlexProps } from '../../types/mrt-ui-props';
import { localizedFilterOption } from '../../fns/filterFns';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_FilterCheckbox } from '../inputs/MRT_FilterCheckbox';
import { MRT_FilterRangeFields } from '../inputs/MRT_FilterRangeFields';
import { MRT_FilterRangeSlider } from '../inputs/MRT_FilterRangeSlider';
import { MRT_FilterTextInput } from '../inputs/MRT_FilterTextInput';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData> extends FlexProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellFilterContainer = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      icons: { IconFilterCog },
      localization,
    },
    refs: { filterInputRefs },
  } = table;
  const { showColumnFilters } = getState();
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;
  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;
  const showChangeModeButton =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const filterOpen = showColumnFilters || columnFilterDisplayMode === 'popover';

  if (!filterOpen) {
    return null;
  }

  return (
    <div {...rest} className={clsx("flex flex-col gap-1", rest?.className)}>
      <div className="flex items-end gap-1">
        {columnDef.filterVariant === 'checkbox' ? (
          <MRT_FilterCheckbox column={column} table={table} />
        ) : columnDef.filterVariant === 'range-slider' ? (
          <MRT_FilterRangeSlider header={header} table={table} />
        ) : ['date-range', 'range'].includes(columnDef.filterVariant ?? '') ||
          ['between', 'betweenInclusive', 'inNumberRange'].includes(
            columnDef._filterFn,
          ) ? (
          <MRT_FilterRangeFields header={header} table={table} />
        ) : (
          <MRT_FilterTextInput header={header} table={table} />
        )}
        {showChangeModeButton && (
          <DropdownMenu modal={columnFilterDisplayMode !== 'popover'}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label={localization.changeFilterMode}
                    className="h-9 w-9 text-muted-foreground"
                    size="icon"
                    variant="ghost"
                  >
                    <IconFilterCog className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent align="start" side="bottom">
                {localization.changeFilterMode}
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" side="bottom">
              <MRT_FilterOptionMenu
                header={header}
                onSelect={() =>
                  setTimeout(
                    () => filterInputRefs.current[`${column.id}-0`]?.focus(),
                    100,
                  )
                }
                table={table}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {showChangeModeButton ? (
        <label
          className={clsx(
            'text-sm text-muted-foreground',
            classes['filter-mode-label'],
          )}
        >
          {localization.filterMode.replace(
            '{filterType}',
            localizedFilterOption(localization, currentFilterOption),
          )}
        </label>
      ) : null}
    </div>
  );
};
