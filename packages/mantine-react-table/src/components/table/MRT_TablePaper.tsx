import clsx from 'clsx';

import classes from './MRT_TablePaper.module.css';

import { Card } from '../ui/card';

import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { resolveThemeStyle } from '../../utils/mrt-style';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar';
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar';
import { MRT_TableContainer } from './MRT_TableContainer';

interface Props<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const theme = useMRTCompatibleTheme();
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      mantinePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table;
  const { isFullScreen } = getState();

  const tablePaperProps = {
    ...parseFromValuesOrFunc(mantinePaperProps, { table }),
    ...rest,
  };

  const baseStyle = resolveThemeStyle(
    tablePaperProps.style as
      | React.CSSProperties
      | ((t: typeof theme) => React.CSSProperties)
      | undefined,
    theme,
  );

  return (
    <Card
      {...tablePaperProps}
      className={clsx(
        'mrt-table-paper rounded-md border shadow-xs',
        classes.root,
        isFullScreen && 'mrt-table-paper-fullscreen',
        tablePaperProps?.className,
      )}
      ref={(ref: HTMLDivElement | null) => {
        tablePaperRef.current = ref;
        if (tablePaperProps?.ref) {
          (
            tablePaperProps.ref as React.MutableRefObject<HTMLDivElement | null>
          ).current = ref;
        }
      }}
      style={{
        zIndex: isFullScreen ? 200 : undefined,
        ...baseStyle,
        ...(isFullScreen
          ? {
              border: 0,
              borderRadius: 0,
              bottom: 0,
              height: '100vh',
              left: 0,
              margin: 0,
              maxHeight: '100vh',
              maxWidth: '100vw',
              padding: 0,
              position: 'fixed',
              right: 0,
              top: 0,
              width: '100vw',
            }
          : null),
      }}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <MRT_TopToolbar table={table} />
        ))}
      <MRT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <MRT_BottomToolbar table={table} />
        ))}
    </Card>
  );
};
