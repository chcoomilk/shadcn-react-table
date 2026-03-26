import clsx from 'clsx';

import classes from './MRT_FilterRangeSlider.module.css';

import { useEffect, useRef, useState } from 'react';

import { type RangeSliderProps } from '../../types/mrt-ui-props';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Slider } from '../ui/slider';

interface Props<TData extends MRT_RowData> extends RangeSliderProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterRangeSlider = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: { mantineFilterRangeSliderProps },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const arg = { column, table };
  const rangeSliderProps = {
    ...parseFromValuesOrFunc(mantineFilterRangeSliderProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterRangeSliderProps, arg),
    ...rest,
  } as Record<string, unknown> & { min?: number; max?: number; step?: number };

  let [min, max] =
    rangeSliderProps.min !== undefined && rangeSliderProps.max !== undefined
      ? [rangeSliderProps.min, rangeSliderProps.max]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState<[number, number]>([
    min,
    max,
  ]);
  const columnFilterValue = column.getFilterValue() as
    | [number, number]
    | undefined;

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  const valsRef = useRef<[number, number]>(filterValues);
  valsRef.current = filterValues;

  const commit = (values: [number, number]) => {
    if (values[0] <= min && values[1] >= max) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(values);
    }
  };

  return (
    <div
      className={clsx('mrt-filter-range-slider', classes.root)}
      ref={(node) => {
        if (node) {
          filterInputRefs.current[`${column.id}-0`] = node as unknown as HTMLInputElement;
          const r = rangeSliderProps.ref;
          if (r && typeof r === 'object' && 'current' in r) {
            (r as { current: unknown }).current = node;
          }
        }
      }}
    >
      <Slider
        className={clsx((rangeSliderProps as { className?: string }).className)}
        max={max}
        min={min}
        minStepsBetweenThumbs={1}
        onValueChange={(values) => {
          const next = [values[0], values[1]] as [number, number];
          valsRef.current = next;
          setFilterValues(next);
        }}
        onValueCommit={(values) => {
          commit([values[0], values[1]] as [number, number]);
        }}
        step={(rangeSliderProps.step as number) ?? 1}
        value={filterValues}
      />
    </div>
  );
};
