import clsx from 'clsx';

import classes from './MRT_ExpandButton.module.css';

import { type MouseEvent } from 'react';

import { useDirection } from '../../lib/hooks';
import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_Box } from '../mrt/MRT_Box';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  table,
  ...rest
}: Props<TData>) => {
  const { dir } = useDirection();
  const {
    options: {
      icons: { IconChevronDown },
      localization,
      mantineExpandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table;

  const actionIconProps = {
    ...parseFromValuesOrFunc(mantineExpandButtonProps, {
      row,
      table,
    }),
    ...rest,
  };

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextInput cell={cell} key={cell.id} table={table} />
    ));

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  const DetailPanel = !!renderDetailPanel?.({
    internalEditComponents,
    row,
    table,
  });

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
    actionIconProps?.onClick?.(event);
  };

  const rtl = dir === 'rtl' || positionExpandColumn === 'last';

  const tooltipLabel =
    (actionIconProps?.title as string | undefined) ??
    (isExpanded ? localization.collapse : localization.expand);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <MRT_Box
          __vars={{
            '--mrt-row-depth': `${row.depth}`,
          }}
          className="inline-flex"
        >
          <Button
            {...actionIconProps}
            aria-label={localization.expand}
            className={clsx(
              'mrt-expand-button h-9 w-9 text-muted-foreground',
              classes.root,
              classes[`root-${rtl ? 'rtl' : 'ltr'}`],
              actionIconProps?.className,
            )}
            disabled={!canExpand && !DetailPanel}
            onClick={handleToggleExpand}
            size="icon"
            variant="ghost"
            title={undefined}
          >
            {actionIconProps?.children ?? (
              <IconChevronDown
                className={clsx(
                  'mrt-expand-button-chevron size-4',
                  classes.chevron,
                  !canExpand && !renderDetailPanel
                    ? classes.right
                    : isExpanded
                      ? classes.up
                      : undefined,
                )}
              />
            )}
          </Button>
        </MRT_Box>
      </TooltipTrigger>
      {!canExpand && !DetailPanel ? null : (
        <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
      )}
    </Tooltip>
  );
};
