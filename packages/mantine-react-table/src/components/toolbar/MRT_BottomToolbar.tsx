import clsx from 'clsx';

import commonClasses from './common.styles.module.css';
import classes from './MRT_BottomToolbar.module.css';

import { useMediaQuery } from '../../lib/hooks';
import { type BoxProps } from '../../types/mrt-ui-props';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_Box } from '../mrt/MRT_Box';
import { MRT_ProgressBar } from './MRT_ProgressBar';
import { MRT_TablePagination } from './MRT_TablePagination';
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner';
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone';

interface Props<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_BottomToolbar = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      enablePagination,
      mantineBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = getState();

  const isMobile = useMediaQuery('(max-width: 720px)');

  const toolbarProps = {
    ...parseFromValuesOrFunc(mantineBottomToolbarProps, {
      table,
    }),
    ...rest,
  };

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

  return (
    <MRT_Box
      {...toolbarProps}
      className={clsx(
        'mrt-bottom-toolbar',
        classes.root,
        commonClasses['common-toolbar-styles'],
        isFullScreen && classes['root-fullscreen'],
        toolbarProps?.className,
      )}
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          bottomToolbarRef.current = node;
          const r = toolbarProps?.ref;
          if (r && typeof r === 'object' && 'current' in r) {
            (r as { current: HTMLDivElement | null }).current = node;
          }
        }
      }}
    >
      <MRT_ProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <MRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone table={table} />
      )}
      <MRT_Box className={classes['custom-toolbar-container']}>
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}
        <MRT_Box
          className={clsx(
            classes['paginator-container'],
            stackAlertBanner && classes['paginator-container-alert-banner'],
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <MRT_TablePagination position="bottom" table={table} />
            )}
        </MRT_Box>
      </MRT_Box>
    </MRT_Box>
  );
};
