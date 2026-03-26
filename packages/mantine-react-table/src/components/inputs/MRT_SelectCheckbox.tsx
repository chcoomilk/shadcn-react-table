import {
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent,
} from 'react';

import { cn } from '../../lib/utils';
import { type CheckboxProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import {
  getIsRowSelected,
  getMRT_RowSelectionHandler,
  getMRT_SelectAllHandler,
} from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData> extends CheckboxProps {
  renderedRowIndex?: number;
  row?: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

/** Radix controls do not expose the native change event; shift-range selection uses synthetic events. */
function syntheticInputEvent(
  checked: boolean,
  shiftKey = false,
): ChangeEvent<HTMLInputElement> {
  return {
    stopPropagation: () => {},
    target: { checked } as HTMLInputElement,
    nativeEvent: { shiftKey } as unknown as MouseEvent['nativeEvent'],
  } as unknown as ChangeEvent<HTMLInputElement>;
}

export const MRT_SelectCheckbox = <TData extends MRT_RowData>({
  renderedRowIndex = 0,
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      enableMultiRowSelection,
      localization,
      mantineSelectAllCheckboxProps,
      mantineSelectCheckboxProps,
      selectAllMode,
      selectDisplayMode,
    },
  } = table;
  const { density, isLoading } = getState();

  const selectAll = !row;

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined;

  const isChecked = selectAll
    ? !!allRowsSelected
    : getIsRowSelected({ row, table });

  const checkboxProps = {
    ...(selectAll
      ? parseFromValuesOrFunc(mantineSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(mantineSelectCheckboxProps, {
          row,
          table,
        })),
    ...rest,
  };

  const onSelectionChange = row
    ? getMRT_RowSelectionHandler({
        renderedRowIndex,
        row,
        table,
      })
    : undefined;

  const onSelectAllChange = getMRT_SelectAllHandler({ table });

  const disabled =
    isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create';

  const stopAndCall =
    (fn: ((e: MouseEvent) => void) | undefined) => (e: MouseEvent) => {
      e.stopPropagation();
      fn?.(e);
    };

  const sizeClass = density === 'xs' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  const indeterminate =
    !isChecked && selectAll
      ? table.getIsSomeRowsSelected()
      : !!(row?.getIsSomeSelected() && row.getCanSelectSubRows());

  const checkedState: boolean | 'indeterminate' = indeterminate
    ? 'indeterminate'
    : Boolean(isChecked);

  const cp = checkboxProps as Record<string, unknown>;
  const radixExtraClassName = cp.className as string | undefined;
  const radixExtraStyle = cp.style as CSSProperties | undefined;
  const radixExtraId = cp.id as string | undefined;

  const tooltipLabel =
    (checkboxProps?.title as string | undefined) ??
    (selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow);

  const control =
    selectDisplayMode === 'switch' ? (
      <Switch
        checked={isChecked}
        className={cn(sizeClass, radixExtraClassName)}
        disabled={disabled}
        id={radixExtraId}
        onCheckedChange={(checked) => {
          if (selectAll)
            onSelectAllChange(syntheticInputEvent(checked === true));
          else
            onSelectionChange?.(syntheticInputEvent(checked === true), checked);
        }}
        style={radixExtraStyle}
      />
    ) : selectDisplayMode === 'radio' || enableMultiRowSelection === false ? (
      <input
        aria-label={
          selectAll ? localization.toggleSelectAll : localization.toggleSelectRow
        }
        checked={isChecked}
        className={cn(
          'aspect-square rounded-full border border-primary text-primary accent-primary',
          sizeClass,
          disabled && 'cursor-not-allowed opacity-50',
        )}
        disabled={disabled}
        name="mrt-row-select"
        onChange={(event) => {
          event.stopPropagation();
          if (selectAll)
            onSelectAllChange(event as unknown as ChangeEvent<HTMLInputElement>);
          else onSelectionChange!(event);
        }}
        onClick={stopAndCall(
          checkboxProps?.onClick as ((e: MouseEvent) => void) | undefined,
        )}
        type="radio"
      />
    ) : (
      <Checkbox
        checked={checkedState}
        className={cn(sizeClass, radixExtraClassName)}
        disabled={disabled}
        id={radixExtraId}
        onCheckedChange={(checked) => {
          const next = checked === true;
          if (selectAll) onSelectAllChange(syntheticInputEvent(next));
          else onSelectionChange?.(syntheticInputEvent(next), next);
        }}
        onClick={stopAndCall(
          checkboxProps?.onClick as ((e: MouseEvent) => void) | undefined,
        )}
        style={radixExtraStyle}
      />
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{control}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
};
