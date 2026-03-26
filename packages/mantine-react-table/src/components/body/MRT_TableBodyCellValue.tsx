import { Fragment, type ReactNode } from 'react';

import {
  type MRT_Cell,
  type MRT_CellValue,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

const allowedTypes = ['string', 'number'];
const allowedFilterVariants = ['text', 'autocomplete'];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightedText({
  children,
  highlight,
}: {
  children: string;
  highlight: string | string[];
}) {
  const terms = (Array.isArray(highlight) ? highlight : [highlight]).filter(
    (t) => t && String(t).length > 0,
  );
  if (!terms.length) return <>{children}</>;
  const pattern = terms.map(escapeRegExp).join('|');
  const parts = children.split(new RegExp(`(${pattern})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => {
        const isHit = terms.some(
          (t) => part.toLowerCase() === String(t).toLowerCase(),
        );
        return isHit ? (
          <mark
            className="rounded-sm bg-yellow-200/90 px-0.5 dark:bg-yellow-900/50"
            key={i}
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
  cell: MRT_Cell<TData, TValue>;
  renderedColumnIndex?: number;
  renderedRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyCellValue = <TData extends MRT_RowData>({
  cell,
  renderedColumnIndex = 0,
  renderedRowIndex = 0,
  table,
}: Props<TData>) => {
  const {
    getState,
    options: { enableFilterMatchHighlighting },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { globalFilter, globalFilterFn } = getState();
  const filterValue = column.getFilterValue();

  let renderedCellValue:
    | ReactNode
    | number
    | string
    | undefined =
    cell.getIsAggregated() && columnDef.AggregatedCell
      ? columnDef.AggregatedCell({
          cell,
          column,
          row,
          table,
        })
      : row.getIsGrouped() && !cell.getIsGrouped()
        ? null
        : cell.getIsGrouped() && columnDef.GroupedCell
          ? columnDef.GroupedCell({
              cell,
              column,
              row,
              table,
            })
          : undefined;

  const isGroupedValue = renderedCellValue !== undefined;

  if (!isGroupedValue) {
    renderedCellValue = cell.renderValue() as number | string;
  }

  if (
    enableFilterMatchHighlighting &&
    columnDef.enableFilterMatchHighlighting !== false &&
    renderedCellValue &&
    allowedTypes.includes(typeof renderedCellValue) &&
    ((filterValue &&
      allowedTypes.includes(typeof filterValue) &&
      allowedFilterVariants.includes(columnDef.filterVariant as string)) ||
      (globalFilter &&
        allowedTypes.includes(typeof globalFilter) &&
        column.getCanGlobalFilter()))
  ) {
    let highlight: string | string[] = (
      column.getFilterValue() ??
      globalFilter ??
      ''
    ).toString() as string;
    if ((filterValue ? columnDef._filterFn : globalFilterFn) === 'fuzzy') {
      highlight = highlight.split(/\s+/).filter(Boolean);
    }

    renderedCellValue = (
      <HighlightedText highlight={highlight}>
        {renderedCellValue?.toString() ?? ''}
      </HighlightedText>
    );
  }

  if (columnDef.Cell && !isGroupedValue) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      renderedColumnIndex,
      renderedRowIndex,
      row,
      table,
    });
  }

  return renderedCellValue;
};
