import clsx from 'clsx';

import classes from './MRT_TablePagination.module.css';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_Box } from '../mrt/MRT_Box';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100].map((x) =>
  x.toString(),
);

interface Props<TData extends MRT_RowData> {
  position?: 'bottom' | 'top';
  table: MRT_TableInstance<TData>;
  [key: string]: unknown;
}

export const MRT_TablePagination = <TData extends MRT_RowData>({
  position = 'bottom',
  table,
  ...props
}: Props<TData>) => {
  const {
    getPrePaginationRowModel,
    getState,
    options: {
      enableToolbarInternalActions,
      icons: {
        IconChevronLeft,
        IconChevronLeftPipe,
        IconChevronRight,
        IconChevronRightPipe,
      },
      localization,
      mantinePaginationProps,
      paginationDisplayMode,
      rowCount,
    },
    setPageIndex,
    setPageSize,
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
    showGlobalFilter,
  } = getState();

  const paginationProps = {
    ...parseFromValuesOrFunc(mantinePaginationProps, {
      table,
    }),
    ...props,
  };

  const totalRowCount = rowCount ?? getPrePaginationRowModel().rows.length;
  const numberOfPages = Math.ceil(totalRowCount / pageSize);
  const showFirstLastPageButtons = numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const {
    rowsPerPageOptions = defaultRowsPerPage,
    showRowsPerPage = true,
    withEdges = showFirstLastPageButtons,
    ...rest
  } = (paginationProps ?? {}) as {
    rowsPerPageOptions?: string[];
    showRowsPerPage?: boolean;
    withEdges?: boolean;
  };

  const needsTopMargin =
    position === 'top' && enableToolbarInternalActions && !showGlobalFilter;

  const rppOptions =
    (paginationProps as { rowsPerPageOptions?: string[] })
      ?.rowsPerPageOptions ?? defaultRowsPerPage;

  return (
    <MRT_Box
      className={clsx(
        'mrt-table-pagination',
        classes.root,
        needsTopMargin && classes['with-top-margin'],
      )}
    >
      {(paginationProps as { showRowsPerPage?: boolean }).showRowsPerPage !==
        false &&
        showRowsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm" id="rpp-label">
              {localization.rowsPerPage}
            </span>
            <Select
              onValueChange={(value) => setPageSize(+value)}
              value={pageSize.toString()}
            >
              <SelectTrigger
                aria-labelledby="rpp-label"
                className={clsx('h-9 w-[4.5rem]', classes.pagesize)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rppOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      {paginationDisplayMode === 'pages' ? (
        <div className="flex flex-wrap items-center gap-1" {...rest}>
          {withEdges && (
            <Button
              aria-label={localization.goToFirstPage}
              className="h-8 w-8"
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex(0)}
              size="icon"
              variant="ghost"
            >
              <IconChevronLeftPipe className="size-4" />
            </Button>
          )}
          <Button
            aria-label={localization.goToPreviousPage}
            className="h-8 w-8"
            disabled={pageIndex <= 0}
            onClick={() => setPageIndex(pageIndex - 1)}
            size="icon"
            variant="ghost"
          >
            <IconChevronLeft className="size-4" />
          </Button>
          {(() => {
            const siblingsCount = 2;
            let pages: (number | 'ellipsis-start' | 'ellipsis-end')[];

            if (numberOfPages <= 9) {
              pages = Array.from({ length: numberOfPages }, (_, i) => i);
            } else {
              const start = Math.max(1, pageIndex - siblingsCount);
              const end = Math.min(numberOfPages - 2, pageIndex + siblingsCount);

              pages = [0];
              if (start > 1) pages.push('ellipsis-start');
              for (let i = start; i <= end; i++) pages.push(i);
              if (end < numberOfPages - 2) pages.push('ellipsis-end');
              pages.push(numberOfPages - 1);
            }

            return pages.map((page) =>
              typeof page === 'string' ? (
                <span
                  className="flex h-8 min-w-8 items-center justify-center text-sm"
                  key={page}
                >
                  …
                </span>
              ) : (
                <Button
                  aria-label={`${localization.goToNextPage?.split(' ').slice(0, 2).join(' ')} ${page + 1}`}
                  className="h-8 min-w-8 px-2"
                  key={page}
                  onClick={() => setPageIndex(page)}
                  size="sm"
                  variant={pageIndex === page ? 'default' : 'ghost'}
                >
                  {page + 1}
                </Button>
              ),
            );
          })()}
          <Button
            aria-label={localization.goToNextPage}
            className="h-8 w-8"
            disabled={lastRowIndex >= totalRowCount}
            onClick={() => setPageIndex(pageIndex + 1)}
            size="icon"
            variant="ghost"
          >
            <IconChevronRight className="size-4" />
          </Button>
          {withEdges && (
            <Button
              aria-label={localization.goToLastPage}
              className="h-8 w-8"
              disabled={lastRowIndex >= totalRowCount}
              onClick={() => setPageIndex(numberOfPages - 1)}
              size="icon"
              variant="ghost"
            >
              <IconChevronRightPipe className="size-4" />
            </Button>
          )}
        </div>
      ) : paginationDisplayMode === 'default' ? (
        <>
          <span className="text-sm">{`${
            lastRowIndex === 0 ? 0 : (firstRowIndex + 1).toLocaleString()
          }-${lastRowIndex.toLocaleString()} ${
            localization.of
          } ${totalRowCount.toLocaleString()}`}</span>
          <div className="flex items-center gap-1.5">
            {withEdges && (
              <Button
                aria-label={localization.goToFirstPage}
                className="h-8 w-8 text-muted-foreground"
                disabled={pageIndex <= 0}
                onClick={() => setPageIndex(0)}
                size="icon"
                variant="ghost"
              >
                <IconChevronLeftPipe className="size-4" />
              </Button>
            )}
            <Button
              aria-label={localization.goToPreviousPage}
              className="h-8 w-8 text-muted-foreground"
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              size="icon"
              variant="ghost"
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              aria-label={localization.goToNextPage}
              className="h-8 w-8 text-muted-foreground"
              disabled={lastRowIndex >= totalRowCount}
              onClick={() => setPageIndex(pageIndex + 1)}
              size="icon"
              variant="ghost"
            >
              <IconChevronRight className="size-4" />
            </Button>
            {withEdges && (
              <Button
                aria-label={localization.goToLastPage}
                className="h-8 w-8 text-muted-foreground"
                disabled={lastRowIndex >= totalRowCount}
                onClick={() => setPageIndex(numberOfPages - 1)}
                size="icon"
                variant="ghost"
              >
                <IconChevronRightPipe className="size-4" />
              </Button>
            )}
          </div>
        </>
      ) : null}
    </MRT_Box>
  );
};
