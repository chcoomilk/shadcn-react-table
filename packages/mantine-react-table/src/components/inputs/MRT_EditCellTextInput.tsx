import {
  type FocusEvent,
  type KeyboardEvent,
  useMemo,
  useState,
} from 'react';

import { Button } from '../ui/button';

import {
  type HTMLPropsRef,
  type MRT_Cell,
  type MRT_CellValue,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

function normalizeOptions(raw: unknown[]): { label: string; value: string }[] {
  return raw.map((o) => {
    if (o !== null && typeof o === 'object' && 'value' in o) {
      const x = o as { label?: string; value: unknown };
      return {
        label: String(x.label ?? x.value),
        value: String(x.value),
      };
    }
    const s = String(o);
    return { label: s, value: s };
  });
}

interface PropsBase<TData extends MRT_RowData, TValue = MRT_CellValue> {
  cell: MRT_Cell<TData, TValue>;
  table: MRT_TableInstance<TData>;
  [key: string]: unknown;
}

type MRT_TextInputProps = HTMLPropsRef<HTMLInputElement> &
  Record<string, unknown>;

export const MRT_EditCellTextInput = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: PropsBase<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      mantineEditSelectProps,
      mantineEditTextInputProps,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;
  const isSelectEdit = columnDef.editVariant === 'select';
  const isMultiSelectEdit = columnDef.editVariant === 'multi-select';

  const [value, setValue] = useState(() => cell.getValue<any>());

  const arg = { cell, column, row, table };
  const textInputProps = {
    ...parseFromValuesOrFunc(mantineEditTextInputProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineEditTextInputProps, arg),
    ...rest,
  } as MRT_TextInputProps;

  const selectProps = {
    ...parseFromValuesOrFunc(mantineEditSelectProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineEditSelectProps, arg),
    ...rest,
  } as { data?: unknown[]; ref?: React.Ref<HTMLButtonElement> };

  const selectOptions = useMemo(
    () => normalizeOptions((selectProps.data ?? []) as unknown[]),
    [selectProps.data],
  );

  const saveInputValueToRowCache = (newValue: null | string | string[]) => {
    //@ts-ignore
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    (textInputProps.onBlur as ((e: FocusEvent<HTMLInputElement>) => void) | undefined)?.(
      event,
    );
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    (textInputProps.onKeyDown as ((e: KeyboardEvent<HTMLInputElement>) => void) | undefined)?.(
      event,
    );
    if (event.key === 'Enter') {
      editInputRefs.current[cell.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return columnDef.Edit?.({ cell, column, row, table });
  }

  const showLabel = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  const commonLabel = showLabel ? (
    <Label className="mb-1 block">{column.columnDef.header}</Label>
  ) : null;

  const editingDisabled =
    parseFromValuesOrFunc(columnDef.enableEditing, row) === false ||
    parseFromValuesOrFunc(enableEditing, row) === false;

  if (isSelectEdit) {
    const v = value === null || value === undefined ? '' : String(value);
    return (
      <div
        className="w-full min-w-[8rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {commonLabel}
        <Select
          disabled={editingDisabled}
          onValueChange={(nv) => {
            setValue(nv);
            saveInputValueToRowCache(nv);
          }}
          value={v || undefined}
        >
          <SelectTrigger
            ref={(node) => {
              if (node) {
                editInputRefs.current[cell.id] = node as unknown as HTMLInputElement;
              }
            }}
            className={
              editDisplayMode === 'table'
                ? 'h-9 border-0 bg-transparent shadow-none'
                : undefined
            }
            disabled={editingDisabled}
          >
            <SelectValue
              placeholder={
                !showLabel ? String(columnDef.header) : undefined
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (isMultiSelectEdit) {
    const selected = (Array.isArray(value) ? value : []) as string[];
    const toggle = (v: string) => {
      setValue((prev: string[]) => {
        const p = Array.isArray(prev) ? prev : [];
        const next = p.includes(v) ? p.filter((x) => x !== v) : [...p, v];
        if (document.activeElement !== editInputRefs.current[cell.id]) {
          saveInputValueToRowCache(next);
        }
        return next;
      });
    };
    return (
      <div
        className="w-full min-w-[8rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {commonLabel}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-10 w-full justify-start font-normal"
              disabled={editingDisabled}
              variant="outline"
            >
              {selected.length
                ? `${selected.length} selected`
                : String(columnDef.header)}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {selectOptions.map((opt) => (
                <label
                  className="flex cursor-pointer items-center gap-2 text-sm"
                  key={opt.value}
                >
                  <Checkbox
                    checked={selected.includes(opt.value)}
                    onCheckedChange={() => toggle(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <button
          className="sr-only"
          ref={(node) => {
            if (node) {
              editInputRefs.current[cell.id] = node as unknown as HTMLInputElement;
            }
          }}
          type="button"
        />
      </div>
    );
  }

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      {commonLabel}
      <Input
        {...textInputProps}
        className={
          editDisplayMode === 'table'
            ? 'h-9 border-0 bg-transparent shadow-none focus-visible:ring-0'
            : undefined
        }
        disabled={editingDisabled}
        name={cell.id}
        onBlur={handleBlur}
        onChange={(event) => {
          (textInputProps.onChange as ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined)?.(
            event,
          );
          setValue(event.target.value);
        }}
        onKeyDown={handleEnterKeyDown}
        placeholder={
          !showLabel ? String(columnDef.header) : undefined
        }
        ref={(node) => {
          if (node) {
            editInputRefs.current[cell.id] = node;
            const r = textInputProps.ref;
            if (r && typeof r === 'object' && 'current' in r) {
              (r as { current: HTMLInputElement | null }).current = node;
            }
          }
        }}
        value={value ?? ''}
      />
    </div>
  );
};
