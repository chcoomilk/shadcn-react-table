import clsx from 'clsx';

import classes from './MRT_ExpandAllButton.module.css';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { IconChevronsDown },
      localization,
      mantineExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const actionIconProps = {
    ...parseFromValuesOrFunc(mantineExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...actionIconProps}
          aria-label={localization.expandAll}
          className={clsx(
            'mrt-expand-all-button h-9 w-9 text-muted-foreground',
            classes.root,
            actionIconProps?.className,
            density,
          )}
          disabled={isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())}
          onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
          size="icon"
          variant="ghost"
          title={undefined}
        >
          {actionIconProps?.children ?? (
            <IconChevronsDown
              className={clsx(
                'size-4',
                classes.chevron,
                isAllRowsExpanded
                  ? classes.up
                  : getIsSomeRowsExpanded()
                    ? classes.right
                    : undefined,
              )}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {(actionIconProps?.title as string | undefined) ??
          (isAllRowsExpanded
            ? localization.collapseAll
            : localization.expandAll)}
      </TooltipContent>
    </Tooltip>
  );
};
