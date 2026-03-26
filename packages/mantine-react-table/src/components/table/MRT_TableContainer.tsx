import clsx from 'clsx';

import classes from './MRT_TableContainer.module.css';

import { useEffect, useLayoutEffect, useState } from 'react';

import { type BoxProps } from '../../types/mrt-ui-props';
import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { mergeCssVars, resolveThemeStyle } from '../../utils/mrt-style';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_Box } from '../mrt/MRT_Box';
import { MRT_LoadingOverlay } from '../mrt/MRT_LoadingOverlay';
import { MRT_EditRowModal } from '../modals/MRT_EditRowModal';
import { MRT_Table } from './MRT_Table';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface Props<TData extends MRT_RowData> extends BoxProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_TableContainer = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableStickyHeader,
      mantineLoadingOverlayProps,
      mantineTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;
  const {
    creatingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = getState();

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(mantineTableContainerProps, { table }),
    ...rest,
  };
  const loadingOverlayProps = parseFromValuesOrFunc(
    mantineLoadingOverlayProps,
    { table },
  );

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? (topToolbarRef.current?.offsetHeight ?? 0)
        : 0;

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
        : 0;

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
  });

  const theme = useMRTCompatibleTheme();

  const createModalOpen = createDisplayMode === 'modal' && creatingRow;
  const editModalOpen = editDisplayMode === 'modal' && editingRow;

  const containerVars = mergeCssVars({
    '--mrt-top-toolbar-height': `${totalToolbarHeight}`,
    ...(tableContainerProps as { __vars?: Record<string, string | number | undefined> })
      .__vars,
  });

  return (
    <MRT_Box
      {...tableContainerProps}
      className={clsx(
        'mrt-table-container',
        classes.root,
        enableStickyHeader && classes['root-sticky'],
        isFullScreen && classes['root-fullscreen'],
        tableContainerProps?.className,
      )}
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          tableContainerRef.current = node;
          if (tableContainerProps?.ref) {
            //@ts-ignore
            tableContainerProps.ref.current = node;
          }
        }
      }}
      style={{
        ...containerVars,
        ...resolveThemeStyle(tableContainerProps.style as any, theme),
      }}
    >
      <MRT_LoadingOverlay
        visible={isLoading || showLoadingOverlay}
        zIndex={2}
        {...loadingOverlayProps}
      />
      <MRT_Table table={table} />
      {(createModalOpen || editModalOpen) && (
        <MRT_EditRowModal open table={table} />
      )}
    </MRT_Box>
  );
};
