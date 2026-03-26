import { type MouseEvent } from 'react';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import {
  type MRT_Cell,
  type MRT_CellValue,
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_RowActionMenu } from '../menus/MRT_RowActionMenu';
import { MRT_EditActionButtons } from './MRT_EditActionButtons';

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
  cell: MRT_Cell<TData, TValue>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleRowActionMenuButton = <TData extends MRT_RowData>({
  cell,
  row,
  table,
}: Props<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons: { IconEdit },
      localization: { edit },
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table;

  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
  };

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row');

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, table })
      ) : showEditActionButtons ? (
        <MRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={edit}
              className="h-9 w-9 text-muted-foreground"
              disabled={!!editingRow && editingRow.id !== row.id}
              onClick={handleStartEditMode}
              size="icon"
              variant="ghost"
            >
              <IconEdit className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{edit}</TooltipContent>
        </Tooltip>
      ) : renderRowActionMenuItems ? (
        <MRT_RowActionMenu
          handleEdit={handleStartEditMode}
          row={row}
          table={table}
        />
      ) : null}
    </>
  );
};
