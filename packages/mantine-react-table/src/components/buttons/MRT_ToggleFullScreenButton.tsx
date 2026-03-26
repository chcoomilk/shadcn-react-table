import clsx from 'clsx';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { type ActionIconProps } from '../../types/mrt-ui-props';
import {
  type HTMLPropsRef,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

interface Props<TData extends MRT_RowData>
  extends ActionIconProps,
    HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFullScreenButton = <TData extends MRT_RowData>({
  table: {
    getState,
    options: {
      icons: { IconMaximize, IconMinimize },
      localization: { toggleFullScreen },
    },
    setIsFullScreen,
  },
  title,
  ...rest
}: Props<TData>) => {
  const { isFullScreen } = getState();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleToggleFullScreen = () => {
    setTooltipOpen(false);
    setIsFullScreen((current) => !current);
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={title ?? toggleFullScreen}
          className={clsx('h-9 w-9 text-muted-foreground', rest?.className)}
          onClick={handleToggleFullScreen}
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          size="icon"
          variant="ghost"
        >
          {isFullScreen ? (
            <IconMinimize className="size-4" />
          ) : (
            <IconMaximize className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {title ?? toggleFullScreen}
      </TooltipContent>
    </Tooltip>
  );
};
