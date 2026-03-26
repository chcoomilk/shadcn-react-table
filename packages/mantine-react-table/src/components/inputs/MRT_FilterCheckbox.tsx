import clsx from 'clsx';

import classes from './MRT_FilterCheckBox.module.css';

import { type CheckboxProps } from '../../types/mrt-ui-props';
import {
  type MRT_CellValue,
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue>
  extends CheckboxProps {
  column: MRT_Column<TData, TValue>;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterCheckbox = <TData extends MRT_RowData>({
  column,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { localization, mantineFilterCheckboxProps },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  const arg = { column, table };
  const checkboxProps = {
    ...parseFromValuesOrFunc(mantineFilterCheckboxProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterCheckboxProps, arg),
    ...rest,
  } as Record<string, unknown>;

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    String(columnDef.header),
  );

  const value = column.getFilterValue();
  const checkedState: boolean | 'indeterminate' =
    value === undefined ? 'indeterminate' : value === 'true';

  const id = `mrt-filter-cb-${column.id}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={clsx(
            'mrt-filter-checkbox flex items-center gap-2',
            classes.root,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={checkedState}
            className={density === 'xs' ? 'h-3.5 w-3.5' : 'h-4 w-4'}
            id={id}
            onCheckedChange={() => {
              column.setFilterValue(
                column.getFilterValue() === undefined
                  ? 'true'
                  : column.getFilterValue() === 'true'
                    ? 'false'
                    : undefined,
              );
            }}
            {...checkboxProps}
          />
          <Label className="cursor-pointer font-normal" htmlFor={id}>
            {(checkboxProps.title as string | undefined) ?? filterLabel}
          </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {(checkboxProps.title as string | undefined) ?? filterLabel}
      </TooltipContent>
    </Tooltip>
  );
};
