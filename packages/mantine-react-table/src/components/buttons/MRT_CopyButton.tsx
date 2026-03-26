import clsx from 'clsx';

import classes from './MRT_CopyButton.module.css';

import { type ReactNode, useCallback, useState } from 'react';

import { cn } from '../../lib/utils';
import { type UnstyledButtonProps } from '../../types/mrt-ui-props';
import {
  type MRT_Cell,
  type MRT_CellValue,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue>
  extends UnstyledButtonProps {
  cell: MRT_Cell<TData, TValue>;
  children: ReactNode;
  table: MRT_TableInstance<TData>;
}

export const MRT_CopyButton = <TData extends MRT_RowData>({
  cell,
  children,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      localization: { clickToCopy, copiedToClipboard },
      mantineCopyButtonProps,
    },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  const arg = { cell, column, row, table };
  const buttonProps = {
    ...parseFromValuesOrFunc(mantineCopyButtonProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineCopyButtonProps, arg),
    ...rest,
  };

  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(String(cell.getValue<string>()));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [cell]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          {...buttonProps}
          className={cn(
            'mrt-copy-button inline-flex cursor-pointer border-0 bg-transparent p-0 text-left',
            classes.root,
            buttonProps?.className,
          )}
          onClick={(e) => {
            e.stopPropagation();
            void copy();
          }}
          role="presentation"
          title={undefined}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        className={clsx(copied && 'border-green-600 text-green-600')}
        side="bottom"
      >
        {(buttonProps?.title as string | undefined) ??
          (copied ? copiedToClipboard : clickToCopy)}
      </TooltipContent>
    </Tooltip>
  );
};
