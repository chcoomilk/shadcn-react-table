// NOTE: Right-click context menu previously used mantine-contextmenu; this story uses a button-triggered menu or simplified interaction for Storybook.

import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from '../../src';
import { Button } from '../../src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../src/components/ui/dropdown-menu';

import { type Meta } from '@storybook/react';
import { IconDotsVertical } from '@tabler/icons-react';

const meta: Meta = {
  title: 'Features/Empty Row Examples',
};

export default meta;

type Person = {
  address?: string;
  city?: string;
  firstName: string;
  lastName: string;
};

const data: Person[] = [];

const columns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
];

export const DefaultEmptyRow = () => {
  const table = useMantineReactTable({ columns, data });

  return <MantineReactTable table={table} />;
};

export const CustomEmptyRow = () => {
  const table = useMantineReactTable({
    columns,
    data,
    renderEmptyRowsFallback: () => (
      <div className="flex justify-center py-8 text-muted-foreground">
        OMG THERE ARE NO ROWS 😳
      </div>
    ),
  });

  return <MantineReactTable table={table} />;
};

export const EmptyRowContextMenu = () => {
  const table = useMantineReactTable({
    columns,
    data,
    renderEmptyRowsFallback: () => (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p className="text-center text-sm text-muted-foreground">
          No rows — open the menu for the same actions that used to appear on
          right-click.
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Row actions" size="sm" variant="outline">
              <IconDotsVertical className="size-4" />
              Row actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onSelect={() => console.info('Insert new row')}
            >
              Insert new row
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.info('download')}>
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  });

  return <MantineReactTable table={table} />;
};

export const EmptyRowExplanationPannel = () => {
  const table = useMantineReactTable({
    columns,
    data,
    renderDetailPanel: () => (
      <div className="flex justify-center p-4 text-center text-sm text-muted-foreground">
        There are no records to display, check if there are any active filters
        on the table, clearing them might help.
      </div>
    ),
  });

  return <MantineReactTable table={table} />;
};
