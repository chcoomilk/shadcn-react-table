import classes from './MRT_ShowHideColumnsMenuItems.module.css';

import {
  type CSSProperties,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useId,
  useRef,
  useState,
} from 'react';

import { useMRTCompatibleTheme } from '../../lib/mrt-theme';
import {
  type MRT_CellValue,
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { reorderColumn } from '../../utils/column.utils';
import { dataVariable, getPrimaryColor } from '../../utils/style.utils';
import { MRT_ColumnPinningButtons } from '../buttons/MRT_ColumnPinningButtons';
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton';
import { MRT_Box } from '../mrt/MRT_Box';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
  allColumns: MRT_Column<TData>[];
  column: MRT_Column<TData, TValue>;
  hoveredColumn: MRT_Column<TData> | null;
  setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenuItems = <TData extends MRT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  setHoveredColumn,
  table,
}: Props<TData>) => {
  const theme = useMRTCompatibleTheme();
  const switchId = useId();
  const {
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
    setColumnOrder,
  } = table;
  const { columnOrder } = getState();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked =
    (columnDefType !== 'group' && column.getIsVisible()) ||
    (columnDefType === 'group' &&
      column.getLeafColumns().some((col) => col.getIsVisible()));

  const handleToggleColumnHidden = (column: MRT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: MRT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const menuItemRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0);
  };

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn) {
      setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder));
    }
  };

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  return (
    <>
      <DropdownMenuItem
        className={classes.root}
        onSelect={(e) => e.preventDefault()}
        ref={menuItemRef}
        style={
          {
            '--_column-depth': `${(column.depth + 0.5) * 2}rem`,
            '--_hover-color': getPrimaryColor(theme),
          } as CSSProperties
        }
        {...(dataVariable('dragging', isDragging) ?? {})}
        {...(dataVariable('order-hovered', hoveredColumn?.id === column.id) ??
          {})}
        onDragEnter={handleDragEnter}
      >
        <MRT_Box className={classes.menu}>
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !allColumns.some(
              (col) => col.columnDef.columnDefType === 'group',
            ) &&
            (columnDef.enableColumnOrdering !== false ? (
              <MRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <MRT_Box className={classes.grab} />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <MRT_ColumnPinningButtons column={column} table={table} />
            ) : (
              <MRT_Box className={classes.pin} />
            ))}
          {enableHiding ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-1 items-center gap-2">
                  <Switch
                    checked={switchChecked}
                    className={classes.switch}
                    disabled={!column.getCanHide()}
                    id={switchId}
                    onCheckedChange={() => handleToggleColumnHidden(column)}
                  />
                  <Label className="cursor-pointer" htmlFor={switchId}>
                    {columnDef.header}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                {localization.toggleVisibility}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className={classes.header}>{columnDef.header}</span>
          )}
        </MRT_Box>
      </DropdownMenuItem>
      {column.columns?.map((c: MRT_Column<TData>, i) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  );
};
