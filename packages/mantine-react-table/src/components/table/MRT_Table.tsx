import clsx from 'clsx';

import classes from './MRT_Table.module.css';

import { type CSSProperties, useMemo } from 'react';

import {
  Table,
  type TableProps as UITableProps,
} from '../ui/table';

import { useMRT_ColumnVirtualizer } from '../../hooks/useMRT_ColumnVirtualizer';
import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import { useMRTColorScheme } from '../../lib/useColorScheme';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { resolveThemeStyle } from '../../utils/mrt-style';
import { adjustStripeHoverColor, parseCSSVarId } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Memo_MRT_TableBody, MRT_TableBody } from '../body/MRT_TableBody';
import { MRT_TableFooter } from '../footer/MRT_TableFooter';
import { MRT_TableHead } from '../head/MRT_TableHead';

interface Props<TData extends MRT_RowData> extends UITableProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_Table = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      mantineTableProps,
      memoMode,
    },
  } = table;
  const { columnSizing, columnSizingInfo, columnVisibility, density } =
    getState();

  const tableProps = {
    highlightOnHover: true,
    horizontalSpacing: density,
    verticalSpacing: density,
    ...parseFromValuesOrFunc(mantineTableProps, { table }),
    ...rest,
  };

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const colSize = header.getSize();
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
    }
    return colSizes;
  }, [columns, columnSizing, columnSizingInfo, columnVisibility]);

  const columnVirtualizer = useMRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  const colorScheme = useMRTColorScheme();
  const theme = useMRTCompatibleTheme();

  const { striped, stripedColor, __vars, style, className, ...restTableProps } =
    tableProps as UITableProps & {
      __vars?: Record<string, string | number | undefined>;
      striped?: boolean | string;
      stripedColor?: string;
    };

  const stripeHover = adjustStripeHoverColor(stripedColor, colorScheme);

  const mergedStyle = {
    ...columnSizeVars,
    '--mrt-striped-row-background-color': stripedColor,
    '--mrt-striped-row-hover-background-color': stripeHover,
    ...(__vars as object),
    ...resolveThemeStyle(style as any, theme),
  } as CSSProperties;

  return (
    <Table
      className={clsx(
        'mrt-table',
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        className,
      )}
      style={mergedStyle}
      {...restTableProps}
    >
      {enableTableHead && <MRT_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (
        <Memo_MRT_TableBody
          {...commonTableGroupProps}
          tableProps={tableProps}
        />
      ) : (
        <MRT_TableBody {...commonTableGroupProps} tableProps={tableProps} />
      )}
      {enableTableFooter && <MRT_TableFooter {...commonTableGroupProps} />}
    </Table>
  );
};
