import clsx from 'clsx';

import classes from './MRT_GlobalFilterTextInput.module.css';

import { useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '../../lib/hooks';
import { type TextInputProps } from '../../types/mrt-ui-props';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';

interface Props<TData extends MRT_RowData> extends TextInputProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_GlobalFilterTextInput = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { IconSearch, IconX },
      localization,
      mantineSearchTextInputProps,
      manualFiltering,
      positionGlobalFilter,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const textFieldProps = {
    ...parseFromValuesOrFunc(mantineSearchTextInputProps, {
      table,
    }),
    ...rest,
  };

  const isMounted = useRef(false);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const [debouncedSearchValue] = useDebouncedValue(
    searchValue,
    manualFiltering ? 500 : 250,
  );

  useEffect(() => {
    setGlobalFilter(debouncedSearchValue || undefined);
  }, [debouncedSearchValue]);

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear();
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
  }, [globalFilter]);

  if (!showGlobalFilter) {
    return null;
  }

  return (
    <div className={clsx('flex items-center gap-1', classes.collapse)}>
      {enableGlobalFilterModes && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={localization.changeSearchMode}
              className="h-8 w-8 text-muted-foreground"
              size="icon"
              variant="ghost"
            >
              <IconSearch className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <MRT_FilterOptionMenu onSelect={handleClear} table={table} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <div
        className={clsx(
          'mrt-global-filter-text-input flex flex-1 items-center gap-1 rounded-md border border-input bg-background px-2',
          classes.root,
          positionGlobalFilter !== 'left' ? 'mx-2' : undefined,
          textFieldProps?.className,
        )}
      >
        {!enableGlobalFilterModes && (
          <IconSearch className="size-4 shrink-0 text-muted-foreground" />
        )}
        <Input
          {...textFieldProps}
          className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          onChange={(event) => {
            setSearchValue(event.target.value);
            (textFieldProps.onChange as ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined)?.(event);
          }}
          placeholder={localization.search}
          ref={(node) => {
            if (node) {
              searchInputRef.current = node;
              const r = textFieldProps?.ref;
              if (r && typeof r === 'object' && 'current' in r) {
                (r as { current: HTMLInputElement | null }).current = node;
              }
            }
          }}
          value={searchValue ?? ''}
        />
        {searchValue ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={localization.clearSearch}
                className="h-8 w-8 shrink-0 text-muted-foreground"
                disabled={!searchValue?.length}
                onClick={handleClear}
                size="icon"
                variant="ghost"
              >
                <IconX className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {localization.clearSearch}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};
