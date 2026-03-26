import clsx from 'clsx';

import classes from './MRT_FilterRangeFields.module.css';

import { type BoxProps } from '../../types/mrt-ui-props';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_Box } from '../mrt/MRT_Box';
import { MRT_FilterTextInput } from './MRT_FilterTextInput';

interface Props<TData extends MRT_RowData> extends BoxProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterRangeFields = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  return (
    <MRT_Box
      {...rest}
      className={clsx('mrt-filter-range-fields', classes.root, rest.className)}
    >
      <MRT_FilterTextInput header={header} rangeFilterIndex={0} table={table} />
      <MRT_FilterTextInput header={header} rangeFilterIndex={1} table={table} />
    </MRT_Box>
  );
};
