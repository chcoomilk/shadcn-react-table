import type { CSSProperties, ReactNode } from 'react';

import { type ModalProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_EditActionButtons } from '../buttons/MRT_EditActionButtons';
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '../ui/dialog';

interface Props<TData extends MRT_RowData> extends Partial<ModalProps> {
  open: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_EditRowModal = <TData extends MRT_RowData>({
  open,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      mantineCreateRowModalProps,
      mantineEditRowModalProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowModalContent,
      renderEditRowModalContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = getState();
  const row = (creatingRow ?? editingRow) as MRT_Row<TData>;

  const arg = { row, table };
  const rawModalProps = {
    ...parseFromValuesOrFunc(mantineEditRowModalProps, arg),
    ...(creatingRow && parseFromValuesOrFunc(mantineCreateRowModalProps, arg)),
    ...rest,
  };

  const {
    opened: _opened,
    onClose: modalOnClose,
    className: modalClassName,
    style: modalStyle,
    title: modalTitle,
    children: _children,
    ...safeModalProps
  } = rawModalProps as ModalProps & {
    className?: string;
    style?: CSSProperties;
    title?: string;
    children?: ReactNode;
  };

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextInput cell={cell} key={cell.id} table={table} />
    ));

  const handleCancel = () => {
    if (creatingRow) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
    modalOnClose?.();
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) handleCancel();
      }}
      open={open}
    >
      <DialogContent
        className={modalClassName}
        hideClose
        key={row.id}
        style={modalStyle}
        {...safeModalProps}
      >
        {((creatingRow &&
          renderCreateRowModalContent?.({
            internalEditComponents,
            row,
            table,
          })) ||
          renderEditRowModalContent?.({
            internalEditComponents,
            row,
            table,
          })) ?? (
          <>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-6 pb-6 pt-4">
                {internalEditComponents}
              </div>
            </form>
            <DialogFooter className="justify-end sm:justify-end">
              <MRT_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
