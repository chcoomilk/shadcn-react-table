import clsx from 'clsx';

import classes from './MRT_TableHeadCellResizeHandle.module.css';

import { type BoxProps } from '../../types/mrt-ui-props';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_Box } from '../mrt/MRT_Box';

interface Props<TData extends MRT_RowData> extends BoxProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;
  const handler = header.getResizeHandler();

  const offset =
    column.getIsResizing() && columnResizeMode === 'onEnd'
      ? `translateX(${
          (columnResizeDirection === 'rtl' ? -1 : 1) *
          (getState().columnSizingInfo.deltaOffset ?? 0)
        }px)`
      : undefined;

  const { __vars: restVars, className: restClassName, ...restBox } = rest as BoxProps & {
    __vars?: Record<string, string | number | undefined>;
  };

  return (
    <MRT_Box
      onDoubleClick={() => {
        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      role="separator"
      {...restBox}
      __vars={{ '--mrt-transform': offset, ...restVars }}
      className={clsx(
        'mrt-table-head-cell-resize-handle',
        classes.root,
        classes[`root-${columnResizeDirection}`],
        !header.subHeaders.length &&
          columnResizeMode === 'onChange' &&
          classes['root-hide'],
        density,
        restClassName,
      )}
    />
  );
};
