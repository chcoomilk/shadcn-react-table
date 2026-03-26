import clsx from 'clsx';

import classes from './MRT_TableHeadCell.module.css';

import {
  type CSSProperties,
  type DragEventHandler,
  type ReactNode,
  useMemo,
  useState,
} from 'react';

import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer';
import { MRT_TableHeadCellFilterLabel } from './MRT_TableHeadCellFilterLabel';
import { MRT_TableHeadCellGrabHandle } from './MRT_TableHeadCellGrabHandle';
import { MRT_TableHeadCellResizeHandle } from './MRT_TableHeadCellResizeHandle';
import { MRT_TableHeadCellSortLabel } from './MRT_TableHeadCellSortLabel';

import { useDirection, useHover } from '../../lib/hooks';
import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import {
  type MRT_ColumnVirtualizer,
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { type TableThProps } from '../../types/mrt-ui-props';
import { mergeCssVars, resolveThemeStyle } from '../../utils/mrt-style';
import { parseCSSVarId } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu';
import { MRT_Box } from '../mrt/MRT_Box';
import { TableTh } from '../ui/table';

interface Props<TData extends MRT_RowData> extends TableThProps {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  header: MRT_Header<TData>;
  renderedHeaderIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCell = <TData extends MRT_RowData>({
  columnVirtualizer,
  header,
  renderedHeaderIndex = 0,
  table,
  ...rest
}: Props<TData>) => {
  const { dir } = useDirection();
  const theme = useMRTCompatibleTheme();
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableHeaderActionsHoverReveal,
      enableMultiSort,
      layoutMode,
      mantineTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const { columnSizingInfo, draggingColumn, grouping, hoveredColumn } =
    getState();
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const arg = { column, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineTableHeadCellProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineTableHeadCellProps, arg),
    ...rest,
  };

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(
      header?.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(header.id)}-size) * 1px)`,
  };
  if (layoutMode === 'grid') {
    widthStyles.flex = `${[0, false].includes(columnDef.grow!)
      ? 0
      : `var(--header-${parseCSSVarId(header.id)}-size)`
      } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const isDraggingColumn = draggingColumn?.id === column.id;
  const isHoveredColumn = hoveredColumn?.id === column.id;

  const [setHoveredHeadCellRef, isHoveredHeadCell] =
    useHover<HTMLTableCellElement>();

  const [isOpenedColumnActions, setIsOpenedColumnActions] = useState(false);

  const columnActionsEnabled =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false;

  const showColumnButtons =
    !enableHeaderActionsHoverReveal ||
    isOpenedColumnActions ||
    (isHoveredHeadCell &&
      !table.getVisibleFlatColumns().find((column) => column.getIsResizing()));

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id))) &&
    showColumnButtons;

  const headerPL = useMemo(() => {
    let pl = 0;
    if (column.getCanSort()) pl++;
    if (showColumnButtons && (columnActionsEnabled || showDragHandle))
      pl += 1.75;
    if (showDragHandle) pl += 1.25;
    return pl;
  }, [showColumnButtons, showDragHandle, columnActionsEnabled]);

  const handleDragEnter: DragEventHandler<HTMLTableCellElement> = (_e) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const headerElement =
    columnDef?.Header instanceof Function
      ? columnDef?.Header?.({
        column,
        header,
        table,
      })
      : (columnDef?.Header ?? (columnDef.header as ReactNode));

  const textAlign: 'center' | 'left' | 'right' =
    columnDefType === 'group'
      ? 'center'
      : dir === 'rtl'
        ? 'right'
        : 'left';

  const cssVars = mergeCssVars({
    '--mrt-table-cell-left':
      isColumnPinned === 'left'
        ? `${column.getStart(isColumnPinned)}`
        : undefined,
    '--mrt-table-cell-right':
      isColumnPinned === 'right'
        ? `${column.getAfter(isColumnPinned)}`
        : undefined,
    ...(tableCellProps as { __vars?: Record<string, number | string | undefined> })
      .__vars,
  });

  const resolvedStyle = resolveThemeStyle(
    tableCellProps.style as
    | ((t: typeof theme) => CSSProperties)
    | CSSProperties
    | undefined,
    theme,
  );

  const {
    __vars: _omitVars,
    align: _omitAlign,
    children: cellChildren,
    className: cellClassName,
    style: _omitStyle,
    ...restCellProps
  } = tableCellProps as {
    __vars?: Record<string, number | string | undefined>;
  } & TableThProps;

  return (
    <TableTh
      colSpan={header.colSpan}
      data-column-pinned={isColumnPinned || undefined}
      data-dragging-column={isDraggingColumn || undefined}
      data-first-right-pinned={
        (isColumnPinned === 'right' &&
          column.getIsFirstColumn(isColumnPinned)) ||
        undefined
      }
      data-hovered-column-target={isHoveredColumn || undefined}
      data-index={renderedHeaderIndex}
      data-last-left-pinned={
        (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) ||
        undefined
      }
      data-resizing={
        (columnResizeMode === 'onChange' &&
          columnSizingInfo?.isResizingColumn === column.id &&
          columnResizeDirection) ||
        undefined
      }
      {...restCellProps}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        enableMultiSort && column.getCanSort() && classes['root-no-select'],
        columnVirtualizer && classes['root-virtualized'],
        cellClassName,
      )}
      onDragEnter={handleDragEnter}
      ref={(node: HTMLTableCellElement | null) => {
        if (node) {
          tableHeadCellRefs.current[column.id] = node;
          setHoveredHeadCellRef(node);
          if (columnDefType !== 'group') {
            columnVirtualizer?.measureElement?.(node);
          }
        }
      }}
      style={{
        ...cssVars,
        ...widthStyles,
        ...resolvedStyle,
        textAlign,
      }}
    >
      {header.isPlaceholder
        ? null
        : (cellChildren ?? (
          <div
            className={clsx(
              'mrt-table-head-cell-content flex',
              classes.content,
              (columnDefType === 'group' ||
                (tableCellProps as { align?: string }).align === 'center') &&
              classes['content-center'],
              (tableCellProps as { align?: string }).align === 'right' &&
              classes['content-right'],
              column.getCanResize() && classes['content-spaced'],
            )}
          >
            <MRT_Box
              __vars={{
                '--mrt-table-head-cell-labels-padding-left': `${headerPL}`,
              }}
              className={clsx(
                'mrt-table-head-cell-labels flex',
                classes.labels,
                column.getCanSort() &&
                columnDefType !== 'group' &&
                classes['labels-sortable'],
                (tableCellProps as { align?: string }).align === 'right'
                  ? classes['labels-right']
                  : (tableCellProps as { align?: string }).align === 'center' &&
                  classes['labels-center'],
                columnDefType === 'data' && classes['labels-data'],
              )}
              onClick={column.getToggleSortingHandler()}
            >
              <div
                className={clsx(
                  'mrt-table-head-cell-content-wrapper flex whitespace-nowrap text-ellipsis',
                  classes['content-wrapper'],
                  columnDefType === 'data' &&
                  classes['content-wrapper-hidden-overflow'],
                )}
              >
                <span className='text-ellipsis whitespace-nowrap w-full overflow-hidden'>
                  {headerElement}
                </span>
              </div>
              {column.getCanFilter() &&
                (column.getIsFiltered() || showColumnButtons) && (
                  <MRT_TableHeadCellFilterLabel
                    header={header}
                    table={table}
                  />
                )}
              {column.getCanSort() &&
                (column.getIsSorted() || showColumnButtons) && (
                  <MRT_TableHeadCellSortLabel header={header} table={table} />
                )}
            </MRT_Box>
            {columnDefType !== 'group' && (
              <div
                className={clsx(
                  'mrt-table-head-cell-content-actions flex',
                  classes['content-actions'],
                )}
              >
                {showDragHandle && (
                  <MRT_TableHeadCellGrabHandle
                    column={column}
                    table={table}
                    tableHeadCellRef={{
                      current: tableHeadCellRefs.current[column.id],
                    }}
                  />
                )}
                {columnActionsEnabled && showColumnButtons && (
                  <MRT_ColumnActionMenu
                    header={header}
                    onChange={setIsOpenedColumnActions}
                    opened={isOpenedColumnActions}
                    table={table}
                  />
                )}
              </div>
            )}
            {column.getCanResize() && (
              <MRT_TableHeadCellResizeHandle header={header} table={table} />
            )}
          </div>
        ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <MRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </TableTh>
  );
};
