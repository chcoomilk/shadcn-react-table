import clsx from 'clsx';

import classes from './MRT_EditActionButtons.module.css';

import { IconLoader2 } from '@tabler/icons-react';

import { type BoxProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_Box } from '../mrt/MRT_Box';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData> extends BoxProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      icons: { IconCircleX, IconDeviceFloppy },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow, isSaving } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs?.current)
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-ignore
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <MRT_Box
      {...rest}
      className={clsx('mrt-edit-action-buttons', classes.root, rest?.className)}
      onClick={(e) => e.stopPropagation()}
    >
      {variant === 'icon' ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={localization.cancel}
                className="h-9 w-9 text-destructive"
                onClick={handleCancel}
                size="icon"
                variant="ghost"
              >
                <IconCircleX className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{localization.cancel}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={localization.save}
                className="h-9 w-9"
                disabled={isSaving}
                onClick={handleSubmitRow}
                size="icon"
                variant="ghost"
              >
                {isSaving ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconDeviceFloppy className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{localization.save}</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <Button onClick={handleCancel} variant="ghost">
            {localization.cancel}
          </Button>
          <Button disabled={isSaving} onClick={handleSubmitRow}>
            {localization.save}
          </Button>
        </>
      )}
    </MRT_Box>
  );
};
