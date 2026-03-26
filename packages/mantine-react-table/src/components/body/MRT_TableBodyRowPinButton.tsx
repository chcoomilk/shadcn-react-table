import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_RowPinButton } from '../buttons/MRT_RowPinButton';
import { MRT_Box } from '../mrt/MRT_Box';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyRowPinButton = <TData extends MRT_RowData>({
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;
  const { density } = getState();

  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

  if (!canPin) return null;

  const rowPinButtonProps = {
    row,
    table,
    ...rest,
  };

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <MRT_Box
        className={
          density === 'xs' ? 'flex flex-row' : 'flex flex-col'
        }
      >
        <MRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <MRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </MRT_Box>
    );
  }

  return (
    <MRT_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  );
};
