import clsx from 'clsx';

import {
  type HTMLPropsRef,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { type ActionIconProps } from '../../types/mrt-ui-props';
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props<TData extends MRT_RowData>
  extends ActionIconProps,
  HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsButton = <TData extends MRT_RowData>({
  table,
  title,
  ...rest
}: Props<TData>) => {
  const {
    icons: { IconColumns },
    localization: { showHideColumns },
  } = table.options;

  return (
    <DropdownMenu modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={title ?? showHideColumns}
              size="icon"
              variant="ghost"
              {...rest}
            >
              <IconColumns className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">{title ?? showHideColumns}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="max-h-[min(24rem,80vh)] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()} side="bottom">
        <MRT_ShowHideColumnsMenu table={table} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
