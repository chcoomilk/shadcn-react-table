import clsx from 'clsx';

import classes from './MRT_TableFooterRow.module.css';

import { type TableTrProps } from '../../types/mrt-ui-props';
import {
  type MRT_ColumnVirtualizer,
  type MRT_Header,
  type MRT_HeaderGroup,
  type MRT_RowData,
  type MRT_TableInstance,
  type MRT_VirtualItem,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { TableTh, TableTr } from '../ui/table';
import { MRT_TableFooterCell } from './MRT_TableFooterCell';

interface Props<TData extends MRT_RowData> extends TableTrProps {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  footerGroup: MRT_HeaderGroup<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableFooterRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  footerGroup,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: { layoutMode, mantineTableFooterRowProps },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  if (
    !footerGroup.headers?.some(
      (header) =>
        (typeof header.column.columnDef.footer === 'string' &&
          !!header.column.columnDef.footer) ||
        header.column.columnDef.Footer,
    )
  ) {
    return null;
  }

  const tableRowProps = {
    ...parseFromValuesOrFunc(mantineTableFooterRowProps, {
      footerGroup,
      table,
    }),
    ...rest,
  };

  return (
    <TableTr
      {...tableRowProps}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes['layout-mode-grid'],
        tableRowProps?.className,
      )}
    >
      {virtualPaddingLeft ? (
        <TableTh
          aria-hidden
          className="flex border-0 p-0"
          style={{ width: virtualPaddingLeft, minWidth: virtualPaddingLeft }}
        />
      ) : null}
      {(virtualColumns ?? footerGroup.headers).map(
        (footerOrVirtualFooter, renderedColumnIndex) => {
          let footer = footerOrVirtualFooter as MRT_Header<TData>;
          if (columnVirtualizer) {
            renderedColumnIndex = (footerOrVirtualFooter as MRT_VirtualItem)
              .index;
            footer = footerGroup.headers[renderedColumnIndex];
          }

          return (
            <MRT_TableFooterCell
              footer={footer}
              key={footer.id}
              renderedColumnIndex={renderedColumnIndex}
              table={table}
            />
          );
        },
      )}
      {virtualPaddingRight ? (
        <TableTh
          aria-hidden
          className="flex border-0 p-0"
          style={{ width: virtualPaddingRight, minWidth: virtualPaddingRight }}
        />
      ) : null}
    </TableTr>
  );
};
