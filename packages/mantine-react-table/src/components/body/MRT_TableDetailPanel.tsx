import clsx from 'clsx';

import classes from './MRT_TableDetailPanel.module.css';

import { type RefObject } from 'react';

import { type TableTdProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_TableInstance,
  type MRT_VirtualItem,
} from '../../types';
import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import { mergeCssVars, resolveThemeStyle } from '../../utils/mrt-style';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { TableTd, TableTr } from '../ui/table';

interface Props<TData extends MRT_RowData> extends TableTdProps {
  parentRowRef: RefObject<HTMLTableRowElement>;
  renderedRowIndex?: number;
  row: MRT_Row<TData>;
  rowVirtualizer?: MRT_RowVirtualizer;
  striped?: false | string;
  table: MRT_TableInstance<TData>;
  virtualRow?: MRT_VirtualItem;
}

export const MRT_TableDetailPanel = <TData extends MRT_RowData>({
  parentRowRef,
  renderedRowIndex = 0,
  row,
  rowVirtualizer,
  striped,
  table,
  virtualRow,
  ...rest
}: Props<TData>) => {
  const theme = useMRTCompatibleTheme();
  const {
    getState,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      mantineDetailPanelProps,
      mantineTableBodyRowProps,
      renderDetailPanel,
    },
  } = table;
  const { isLoading } = getState();

  const tableRowProps = (parseFromValuesOrFunc(mantineTableBodyRowProps, {
    isDetailPanel: true,
    row,
    table,
  }) ?? {}) as Record<string, unknown> & {
    __vars?: Record<string, string | number | undefined>;
    className?: string;
    style?: object;
  };

  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  } as TableTdProps & {
    __vars?: Record<string, string | number | undefined>;
    className?: string;
  };

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextInput cell={cell} key={cell.id} table={table} />
    ));

  const DetailPanel =
    !isLoading &&
    row.getIsExpanded() &&
    renderDetailPanel?.({ internalEditComponents, row, table });

  const {
    __vars: rowVars,
    className: trClassName,
    style: trStyle,
    ...restTr
  } = tableRowProps;

  const {
    __vars: tdVars,
    className: tdClassName,
    style: tdStyle,
    ...restTd
  } = tableCellProps as typeof tableCellProps & { style?: any };

  const panelInner = rowVirtualizer ? (
    row.getIsExpanded() && DetailPanel
  ) : (
    <Collapsible open={row.getIsExpanded()}>
      <CollapsibleContent className="data-[state=closed]:hidden">
        {DetailPanel}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <TableTr
      data-index={
        renderDetailPanel ? renderedRowIndex * 2 + 1 : renderedRowIndex
      }
      data-striped={striped}
      ref={(node: HTMLTableRowElement | null) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      {...(restTr as object)}
      className={clsx(
        'mrt-table-tr-detail-panel',
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        virtualRow && classes['root-virtual-row'],
        trClassName,
      )}
      style={{
        ...mergeCssVars({
          '--mrt-parent-row-height': virtualRow
            ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
            : undefined,
          '--mrt-virtual-row-start': virtualRow
            ? `${virtualRow.start}px`
            : undefined,
          ...rowVars,
        }),
        ...resolveThemeStyle(trStyle as any, theme),
      }}
    >
      <TableTd
        colSpan={getVisibleLeafColumns().length}
        {...restTd}
        className={clsx(
          'mrt-table-td-detail-panel',
          classes.inner,
          layoutMode?.startsWith('grid') && classes['inner-grid'],
          row.getIsExpanded() && classes['inner-expanded'],
          virtualRow && classes['inner-virtual'],
          row.getIsExpanded() && DetailPanel ? 'p-4' : 'p-0',
          tdClassName,
        )}
        style={{
          ...mergeCssVars({
            '--mrt-inner-width': `${table.getTotalSize()}px`,
            ...tdVars,
          }),
          ...resolveThemeStyle(tdStyle, theme),
        }}
      >
        {panelInner}
      </TableTd>
    </TableTr>
  );
};
