import clsx from 'clsx';

import classes from './MRT_GrabHandleButton.module.css';

import { type DragEventHandler } from 'react';

import {
  type HTMLPropsRef,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { type ActionIconProps } from '../../types/mrt-ui-props';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { TooltipPortal } from '@radix-ui/react-tooltip';

interface Props<TData extends MRT_RowData> {
  actionIconProps?: ActionIconProps & HTMLPropsRef<HTMLButtonElement>;
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: MRT_TableInstance<TData>;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
  actionIconProps,
  onDragEnd,
  onDragStart,
  table: {
    options: {
      icons: { IconGripHorizontal },
      localization: { move },
    },
  },
}: Props<TData>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...actionIconProps}
          aria-label={
            (actionIconProps?.title as string | undefined) ?? move
          }
          className={clsx(
            'mrt-grab-handle-button h-8 w-8 text-muted-foreground',
            classes['grab-icon'],
            actionIconProps?.className,
          )}
          draggable
          onClick={(e) => {
            e.stopPropagation();
            actionIconProps?.onClick?.(e);
          }}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          size="icon"
          variant="ghost"
        >
          <IconGripHorizontal className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipPortal>

        <TooltipContent side="bottom">
          {(actionIconProps?.title as string | undefined) ?? move}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
