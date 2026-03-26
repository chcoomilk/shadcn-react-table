import clsx from 'clsx';

import classes from './MRT_TableFooterCell.module.css';

import { type CSSProperties } from 'react';

import { useDirection } from '../../lib/hooks';
import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import { type TableThProps } from '../../types/mrt-ui-props';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { mergeCssVars, resolveThemeStyle } from '../../utils/mrt-style';
import { parseCSSVarId } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { TableTh } from '../ui/table';

interface Props<TData extends MRT_RowData> extends TableThProps {
  footer: MRT_Header<TData>;
  renderedColumnIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableFooterCell = <TData extends MRT_RowData>({
  footer,
  renderedColumnIndex,
  table,
  ...rest
}: Props<TData>) => {
  const { dir } = useDirection();
  const theme = useMRTCompatibleTheme();
  const {
    options: { enableColumnPinning, layoutMode, mantineTableFooterCellProps },
  } = table;
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const args = { column, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineTableFooterCellProps, args),
    ...parseFromValuesOrFunc(columnDef.mantineTableFooterCellProps, args),
    ...rest,
  };

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(
      footer?.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(footer.id)}-size) * 1px)`,
  };
  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--header-${parseCSSVarId(footer.id)}-size)`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  const rawAlign = (tableCellProps as { align?: string }).align;
  const textAlign: 'center' | 'left' | 'right' =
    rawAlign === 'center' || rawAlign === 'right' || rawAlign === 'left'
      ? rawAlign
      : columnDefType === 'group'
        ? 'center'
        : dir === 'rtl'
          ? 'right'
          : 'left';

  const cssVars = mergeCssVars({
    '--mrt-cell-align': textAlign,
    '--mrt-table-cell-left':
      isColumnPinned === 'left'
        ? `${column.getStart(isColumnPinned)}`
        : undefined,
    '--mrt-table-cell-right':
      isColumnPinned === 'right'
        ? `${column.getAfter(isColumnPinned)}`
        : undefined,
    ...(tableCellProps as { __vars?: Record<string, string | number | undefined> })
      .__vars,
  });

  const resolvedStyle = resolveThemeStyle(
    tableCellProps.style as
      | CSSProperties
      | ((t: typeof theme) => CSSProperties)
      | undefined,
    theme,
  );

  const {
    __vars: _v,
    align: _a,
    style: _s,
    children: cellChildren,
    className: cellClassName,
    ...restCellProps
  } = tableCellProps as TableThProps & {
    __vars?: Record<string, string | number | undefined>;
  };

  return (
    <TableTh
      colSpan={footer.colSpan}
      data-column-pinned={isColumnPinned || undefined}
      data-first-right-pinned={
        (isColumnPinned === 'right' &&
          column.getIsFirstColumn(isColumnPinned)) ||
        undefined
      }
      data-index={renderedColumnIndex}
      data-last-left-pinned={
        (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) ||
        undefined
      }
      {...restCellProps}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes.grid,
        columnDefType === 'group' && classes.group,
        cellClassName,
      )}
      style={{
        ...cssVars,
        ...widthStyles,
        ...resolvedStyle,
        textAlign,
      }}
    >
      {cellChildren ??
        (footer.isPlaceholder
          ? null
          : (parseFromValuesOrFunc(columnDef.Footer, {
              column,
              footer,
              table,
            }) ??
            columnDef.footer ??
            null))}
    </TableTh>
  );
};
