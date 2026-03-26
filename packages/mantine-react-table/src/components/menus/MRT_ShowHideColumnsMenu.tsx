import clsx from 'clsx';

import classes from './MRT_ShowHideColumnsMenu.module.css';

import { useMemo, useState } from 'react';

import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems';

import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';
import { Button } from '../ui/button';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';

interface Props<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenu = <TData extends MRT_RowData>({
  table,
}: Props<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table;
  const { columnOrder, columnPinning } = getState();

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as MRT_Column<TData>[];

  const [hoveredColumn, setHoveredColumn] = useState<MRT_Column<TData> | null>(
    null,
  );

  return (
    <div className={clsx("overflow-x-clip", classes.root)}>
      <div className={clsx('flex flex-wrap gap-1', classes.content)}>
        {enableHiding && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={() => handleToggleAllColumns(false)}
            size="sm"
            variant="ghost"
          >
            {localization.hideAll}
          </Button>
        )}
        {enableColumnOrdering && (
          <Button
            onClick={() =>
              table.setColumnOrder(
                getDefaultColumnOrderIds(table.options as any, true),
              )
            }
            size="sm"
            variant="ghost"
          >
            {localization.resetOrder}
          </Button>
        )}
        {enableColumnPinning && (
          <Button
            disabled={!getIsSomeColumnsPinned()}
            onClick={() => table.resetColumnPinning(true)}
            size="sm"
            variant="ghost"
          >
            {localization.unpinAll}
          </Button>
        )}
        {enableHiding && (
          <Button
            disabled={getIsAllColumnsVisible()}
            onClick={() => handleToggleAllColumns(true)}
            size="sm"
            variant="ghost"
          >
            {localization.showAll}
          </Button>
        )}
      </div>
      <DropdownMenuSeparator />
      {allColumns.map((column, index) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={column}
          hoveredColumn={hoveredColumn}
          key={`${index}-${column.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </div>
  );
};
