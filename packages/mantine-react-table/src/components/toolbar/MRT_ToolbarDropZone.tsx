import clsx from 'clsx';

import classes from './MRT_ToolbarDropZone.module.css';

import { type DragEvent, useEffect } from 'react';

import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { type FlexProps } from '../../types/mrt-ui-props';

interface Props<TData extends MRT_RowData> extends FlexProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToolbarDropZone = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

  const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  useEffect(() => {
    if (table.options.state?.showToolbarDropZone !== undefined) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
  }, [enableGrouping, draggingColumn, grouping]);

  if (!showToolbarDropZone) {
    return null;
  }

  return (
    <div
      className={clsx(
        'mrt-toolbar-dropzone flex items-center justify-center py-2 transition-opacity duration-150',
        classes.root,
        hoveredColumn?.id === 'drop-zone' && classes.hovered,
      )}
      onDragEnter={handleDragEnter}
      {...rest}
    >
      <span className="text-sm text-muted-foreground">
        {localization.dropToGroupBy.replace(
          '{column}',
          String(draggingColumn?.columnDef?.header ?? ''),
        )}
      </span>
    </div>
  );
};
