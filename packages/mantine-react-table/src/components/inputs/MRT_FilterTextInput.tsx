import clsx from 'clsx';

import classes from './MRT_FilterTextInput.module.css';

import {
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useDebouncedValue } from '../../lib/hooks';
import { type TextInputProps } from '../../types/mrt-ui-props';
import { localizedFilterOption } from '../../fns/filterFns';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_Box } from '../mrt/MRT_Box';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
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

interface Props<TData extends MRT_RowData> extends TextInputProps {
  header: MRT_Header<TData>;
  rangeFilterIndex?: number;
  table: MRT_TableInstance<TData>;
}

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

export const MRT_FilterTextInput = <TData extends MRT_RowData>({
  header,
  rangeFilterIndex,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      icons: { IconX },
      localization,
      mantineFilterAutocompleteProps,
      mantineFilterDateInputProps,
      mantineFilterMultiSelectProps = {
        clearable: true,
      },
      mantineFilterSelectProps,
      mantineFilterTextInputProps,
      manualFiltering,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const arg = { column, rangeFilterIndex, table };
  const textInputProps = {
    ...parseFromValuesOrFunc(mantineFilterTextInputProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterTextInputProps, arg),
    ...rest,
  };

  const selectProps = {
    ...parseFromValuesOrFunc(mantineFilterSelectProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterSelectProps, arg),
  };

  const multiSelectProps = {
    ...parseFromValuesOrFunc(mantineFilterMultiSelectProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterMultiSelectProps, arg),
  };

  const dateInputProps = {
    ...parseFromValuesOrFunc(mantineFilterDateInputProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterDateInputProps, arg),
  };

  const autoCompleteProps = {
    ...parseFromValuesOrFunc(mantineFilterAutocompleteProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterAutocompleteProps, arg),
  };

  const isRangeFilter =
    columnDef.filterVariant === 'range' ||
    columnDef.filterVariant === 'date-range' ||
    rangeFilterIndex !== undefined;
  const isSelectFilter = columnDef.filterVariant === 'select';
  const isMultiSelectFilter = columnDef.filterVariant === 'multi-select';
  const isDateFilter =
    columnDef.filterVariant === 'date' ||
    columnDef.filterVariant === 'date-range';
  const isAutoCompleteFilter = columnDef.filterVariant === 'autocomplete';
  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  const currentFilterOption = columnDef._filterFn;
  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? localizedFilterOption(localization, currentFilterOption)
    : '';
  const filterPlaceholder = !isRangeFilter
    ? (textInputProps?.placeholder ??
      localization.filterByColumn?.replace(
        '{column}',
        String(columnDef.header),
      ))
    : rangeFilterIndex === 0
      ? localization.min
      : rangeFilterIndex === 1
        ? localization.max
        : '';

  const facetedUniqueValues = column.getFacetedUniqueValues();

  const filterSelectOptions = useMemo(
    () =>
      (
        (autoCompleteProps as { data?: unknown[] })?.data ??
        (selectProps as { data?: unknown[] })?.data ??
        (multiSelectProps as { data?: unknown[] })?.data ??
        ((isAutoCompleteFilter || isSelectFilter || isMultiSelectFilter) &&
        facetedUniqueValues
          ? Array.from(facetedUniqueValues.keys())
              .filter((key) => key !== null)
              .sort((a, b) => String(a).localeCompare(String(b)))
          : [])
      ).filter((o: unknown) => o !== undefined && o !== null),
    [
      (autoCompleteProps as { data?: unknown[] })?.data,
      facetedUniqueValues,
      isAutoCompleteFilter,
      isMultiSelectFilter,
      isSelectFilter,
      (multiSelectProps as { data?: unknown[] })?.data,
      (selectProps as { data?: unknown[] })?.data,
    ],
  );

  const normalizedOptions = useMemo(
    () => normalizeOptions(filterSelectOptions as unknown[]),
    [filterSelectOptions],
  );

  const isMounted = useRef(false);

  const [filterValue, setFilterValue] = useState<any>(() =>
    isMultiSelectFilter
      ? (column.getFilterValue() as string[]) || []
      : isRangeFilter
        ? (column.getFilterValue() as [string, string])?.[
            rangeFilterIndex as number
          ] || ''
        : ((column.getFilterValue() as string) ?? ''),
  );

  const [debouncedFilterValue] = useDebouncedValue(
    filterValue,
    manualFiltering ? 400 : 200,
  );

  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  useEffect(() => {
    if (!isMounted.current) return;
    if (isRangeFilter) {
      column.setFilterValue((old: [string, string]) => {
        const newFilterValues = Array.isArray(old) ? old : ['', ''];
        newFilterValues[rangeFilterIndex as number] =
          debouncedFilterValue as string;
        return newFilterValues;
      });
    } else {
      column.setFilterValue(debouncedFilterValue ?? undefined);
    }
  }, [debouncedFilterValue]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const tableFilterValue = column.getFilterValue();
    if (tableFilterValue === undefined) {
      handleClear();
    } else if (isRangeFilter && rangeFilterIndex !== undefined) {
      setFilterValue(
        ((tableFilterValue ?? ['', '']) as [string, string])[rangeFilterIndex],
      );
    } else {
      setFilterValue(tableFilterValue ?? '');
    }
  }, [column.getFilterValue()]);

  const handleClear = () => {
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else if (isRangeFilter) {
      setFilterValue('');
      column.setFilterValue((old: [string | undefined, string | undefined]) => {
        const newFilterValues = Array.isArray(old) ? old : ['', ''];
        newFilterValues[rangeFilterIndex as number] = undefined;
        return newFilterValues;
      });
    } else if (isSelectFilter) {
      setFilterValue(null);
      column.setFilterValue(null);
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
  };

  const handleClearEmptyFilterChip = () => {
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const { className, ...commonProps } = {
    'aria-label': filterPlaceholder,
    className: clsx(
      'mrt-filter-text-input',
      classes.root,
      isDateFilter
        ? classes['date-filter']
        : isRangeFilter
          ? classes['range-filter']
          : !filterChipLabel && classes['not-filter-chip'],
    ),
    disabled: !!filterChipLabel,
    onClick: (event: MouseEvent<HTMLInputElement>) => event.stopPropagation(),
    placeholder: filterPlaceholder,
    style: {
      ...(isMultiSelectFilter
        ? (multiSelectProps as { style?: object })?.style
        : isSelectFilter
          ? (selectProps as { style?: object })?.style
          : isDateFilter
            ? (dateInputProps as { style?: object })?.style
            : textInputProps?.style),
    },
    title: filterPlaceholder,
    value:
      isMultiSelectFilter && !Array.isArray(filterValue) ? [] : filterValue,
    variant: 'unstyled',
  } as const;

  const ClearButton = filterValue ? (
    <Button
      aria-label={localization.clearFilter}
      className="h-8 w-8 shrink-0 text-muted-foreground"
      onClick={handleClear}
      size="icon"
      title={localization.clearFilter ?? ''}
      variant="ghost"
    >
      <IconX className="size-4" />
    </Button>
  ) : null;

  if (columnDef.Filter) {
    return (
      <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
    );
  }

  if (filterChipLabel) {
    return (
      <MRT_Box style={commonProps.style}>
        <Badge
          className={clsx(
            'flex items-center gap-1 pr-1 text-base',
            classes['filter-chip-badge'],
          )}
        >
          <span
            className="cursor-pointer"
            onClick={handleClearEmptyFilterChip}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleClearEmptyFilterChip()
            }
            role="button"
            tabIndex={0}
          >
            {filterChipLabel}
          </span>
          {ClearButton}
        </Badge>
      </MRT_Box>
    );
  }

  if (isMultiSelectFilter) {
    const selected = (Array.isArray(filterValue) ? filterValue : []) as string[];
    const toggle = (v: string) => {
      setFilterValue((prev: string[]) => {
        const p = Array.isArray(prev) ? prev : [];
        return p.includes(v) ? p.filter((x) => x !== v) : [...p, v];
      });
    };
    return (
      <div
        className={clsx(className, (multiSelectProps as { className?: string }).className, 'flex w-full min-w-[8rem] items-center gap-1')}
        style={commonProps.style}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-10 flex-1 justify-start font-normal"
              disabled={commonProps.disabled}
              onClick={(e) => e.stopPropagation()}
              variant="outline"
            >
              {selected.length
                ? `${selected.length} selected`
                : filterPlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {normalizedOptions.map((opt) => (
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
        {selected.length > 0 && (multiSelectProps as { clearable?: boolean }).clearable !== false
          ? ClearButton
          : null}
        <input
          aria-hidden
          className="sr-only"
          readOnly
          ref={(node) => {
            if (node) {
              filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
                node;
            }
          }}
          tabIndex={-1}
        />
      </div>
    );
  }

  if (isSelectFilter) {
    const v =
      filterValue === null || filterValue === undefined
        ? ''
        : String(filterValue);
    return (
      <div
        className={clsx(
          className,
          (selectProps as { className?: string }).className,
          'flex w-full min-w-[8rem] items-center gap-1',
        )}
        style={commonProps.style}
      >
        <Select
          onValueChange={(val) => setFilterValue(val || null)}
          value={v || undefined}
        >
          <SelectTrigger
            className="h-10 flex-1"
            disabled={commonProps.disabled}
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {normalizedOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {v ? ClearButton : null}
        <input
          aria-hidden
          className="sr-only"
          readOnly
          ref={(node) => {
            if (node) {
              filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
                node;
            }
          }}
          tabIndex={-1}
        />
      </div>
    );
  }

  if (isDateFilter) {
    // NOTE: Date filter UX may differ from Mantine DateInput (popover behavior, keyboard).
    const dateVal = filterValue ? new Date(String(filterValue)) : undefined;
    const valid =
      dateVal && !Number.isNaN(dateVal.getTime()) ? dateVal : undefined;
    return (
      <div
        className={clsx(
          className,
          (dateInputProps as { className?: string }).className,
          'flex w-full items-center gap-1',
        )}
        style={commonProps.style}
      >
        <Popover
          modal={columnFilterDisplayMode === 'popover'}
        >
          <PopoverTrigger asChild>
            <Button
              className="h-10 flex-1 justify-start font-normal"
              disabled={commonProps.disabled}
              onClick={(e) => e.stopPropagation()}
              variant="outline"
            >
              {valid
                ? valid.toLocaleDateString()
                : (filterPlaceholder ?? 'Pick date')}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              onSelect={(d) => {
                setFilterValue(d ? d.toISOString().slice(0, 10) : '');
              }}
              selected={valid}
            />
          </PopoverContent>
        </Popover>
        {filterValue ? ClearButton : null}
        <input
          aria-hidden
          className="sr-only"
          readOnly
          ref={(node) => {
            if (node) {
              filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
                node;
            }
          }}
          tabIndex={-1}
        />
      </div>
    );
  }

  if (isAutoCompleteFilter) {
    return (
      <div
        className={clsx(
          className,
          (autoCompleteProps as { className?: string }).className,
          'flex w-full items-center gap-1',
        )}
        style={commonProps.style}
      >
        <Popover
          onOpenChange={setAutoCompleteOpen}
          open={autoCompleteOpen}
        >
          <PopoverTrigger asChild>
            <Button
              className="h-10 flex-1 justify-start font-normal"
              disabled={commonProps.disabled}
              onClick={(e) => e.stopPropagation()}
              variant="outline"
            >
              {filterValue ? String(filterValue) : filterPlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder={String(filterPlaceholder)} />
              <CommandList>
                <CommandEmpty>No matches</CommandEmpty>
                {normalizedOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => {
                      setFilterValue(opt.value);
                      setAutoCompleteOpen(false);
                    }}
                    value={opt.value}
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {filterValue?.toString()?.length ? ClearButton : null}
        <input
          aria-hidden
          className="sr-only"
          readOnly
          ref={(node) => {
            if (node) {
              filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
                node;
            }
          }}
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        className,
        textInputProps.className,
        'flex w-full items-center gap-1 rounded-md border border-input bg-background px-2',
      )}
      style={commonProps.style}
    >
      <Input
        {...textInputProps}
        aria-label={filterPlaceholder}
        className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        disabled={commonProps.disabled}
        onChange={(e) => {
          setFilterValue(e.target.value);
          (textInputProps.onChange as ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined)?.(e);
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder={filterPlaceholder}
        ref={(node) => {
          if (node) {
            filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
              node;
            const r = textInputProps.ref;
            if (r && typeof r === 'object' && 'current' in r) {
              (r as { current: HTMLInputElement | null }).current = node;
            }
          }
        }}
        title={filterPlaceholder}
        value={filterValue ?? ''}
      />
      {filterValue?.toString()?.length ? ClearButton : null}
    </div>
  );
};
