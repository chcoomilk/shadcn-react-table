import { type ReactNode } from 'react';

import { MRT_ExpandAllButton } from '../../components/buttons/MRT_ExpandAllButton';
import { MRT_ExpandButton } from '../../components/buttons/MRT_ExpandButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import {
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getMRT_RowExpandColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          align: 'right',
        } as const)
      : undefined;

  return {
    Cell: ({ cell, column, row, table }) => {
      const expandButtonProps = { row, table };
      const subRowsLength = row.subRows?.length;
      if (tableOptions.groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <div className="flex items-center gap-1">
            <MRT_ExpandButton {...expandButtonProps} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{row.groupingValue as ReactNode}</span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {table.getColumn(row.groupingColumnId).columnDef.header}
              </TooltipContent>
            </Tooltip>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </div>
        );
      } else {
        return (
          <>
            <MRT_ExpandButton {...expandButtonProps} />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return (
            <div className="flex items-center gap-1">
              <MRT_ExpandAllButton table={table} />
              {groupedColumnMode === 'remove' &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(', ')}
            </div>
          );
        }
      : undefined,
    mantineTableBodyCellProps: alignProps,
    mantineTableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'mrt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};
