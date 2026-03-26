import clsx from 'clsx';

import classes from './MRT_ProgressBar.module.css';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { type ProgressProps } from '../../types/mrt-ui-props';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Progress } from '../ui/progress';

interface Props<TData extends MRT_RowData> extends Partial<ProgressProps> {
  isTopToolbar: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_ProgressBar = <TData extends MRT_RowData>({
  isTopToolbar,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { mantineProgressProps },
  } = table;
  const { isSaving, showProgressBars } = getState();

  const linearProgressProps = {
    ...parseFromValuesOrFunc(mantineProgressProps, {
      isTopToolbar,
      table,
    }),
    ...rest,
  };

  if (!isSaving && !showProgressBars) {
    return null;
  }

  return (
    <div
      className={clsx(
        classes.collapse,
        'overflow-hidden',
        isTopToolbar && classes['collapse-top'],
      )}
    >
      <Progress
        aria-busy="true"
        aria-label="Loading"
        value="indeterminate"
        {...linearProgressProps}
        className={clsx("h-1 rounded-none", linearProgressProps?.className)}
      />
    </div>
  );
};
