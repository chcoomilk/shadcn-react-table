import clsx from 'clsx';

import classes from './MRT_ToolbarAlertBanner.module.css';

import { Fragment, useMemo } from 'react';

import { type AlertProps } from '../../types/mrt-ui-props';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getMRT_SelectAllHandler } from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_SelectCheckbox } from '../inputs/MRT_SelectCheckbox';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';

interface Props<TData extends MRT_RowData> extends Partial<AlertProps> {
  stackAlertBanner?: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_ToolbarAlertBanner = <TData extends MRT_RowData>({
  stackAlertBanner,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getPrePaginationRowModel,
    getState,
    options: {
      enableRowSelection,
      enableSelectAll,
      icons: { IconX },
      localization,
      mantineToolbarAlertBannerBadgeProps,
      mantineToolbarAlertBannerProps,
      manualPagination,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
  } = table;
  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const alertProps = {
    ...parseFromValuesOrFunc(mantineToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  };
  const badgeProps = parseFromValuesOrFunc(
    mantineToolbarAlertBannerBadgeProps,
    { table },
  );

  const totalRowCount = rowCount ?? getPrePaginationRowModel().flatRows.length;

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : getFilteredSelectedRowModel().rows.length,
    [rowSelection, totalRowCount, manualPagination],
  );

  const selectedAlert = selectedRowCount ? (
    <div className="flex flex-wrap items-center gap-3">
      {localization.selectedCountOfRowCountRowsSelected
        ?.replace('{selectedCount}', selectedRowCount.toString())
        ?.replace('{rowCount}', totalRowCount.toString())}
      <Button
        onClick={(event) =>
          getMRT_SelectAllHandler({ table })(event, false, true)
        }
        size="sm"
        variant="ghost"
      >
        {localization.clearSelection}
      </Button>
    </div>
  ) : null;

  const groupedAlert =
    grouping.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 ? localization.thenBy : ''}
            <span
              {...badgeProps}
              className={clsx(
                'inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground',
                classes['alert-badge'],
                badgeProps?.className,
              )}
            >
              {table.getColumn(columnId).columnDef.header}
              <button
                aria-label="Remove grouping"
                className="rounded-sm p-0.5 hover:bg-primary/80"
                onClick={() => table.getColumn(columnId).toggleGrouping()}
                type="button"
              >
                <IconX className="size-3" />
              </button>
            </span>
          </Fragment>
        ))}
      </div>
    ) : null;

  const open = showAlertBanner || !!selectedAlert || !!groupedAlert;

  if (!open) {
    return null;
  }

  return (
    <div
      className={clsx(
        stackAlertBanner && 'duration-200 animate-in fade-in',
      )}
    >
      <Alert
        {...alertProps}
        className={clsx(
          'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100',
          classes.alert,
          stackAlertBanner &&
            !positionToolbarAlertBanner &&
            classes['alert-stacked'],
          !stackAlertBanner &&
            positionToolbarAlertBanner === 'bottom' &&
            classes['alert-bottom'],
          alertProps?.className,
        )}
      >
        {renderToolbarAlertBannerContent?.({
          groupedAlert,
          selectedAlert,
          table,
        }) ?? (
          <div
            className={clsx(
              classes['toolbar-alert'],
              'flex gap-3',
              positionToolbarAlertBanner === 'head-overlay' &&
                classes['head-overlay'],
              density,
            )}
          >
            {enableRowSelection &&
              enableSelectAll &&
              positionToolbarAlertBanner === 'head-overlay' && (
                <MRT_SelectCheckbox table={table} />
              )}
            <div className="flex flex-col gap-2">
              {alertProps?.children}
              {selectedAlert}
              {groupedAlert}
            </div>
          </div>
        )}
      </Alert>
    </div>
  );
};
