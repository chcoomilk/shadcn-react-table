// NOTE: Right-click context menu previously used mantine-contextmenu; this story uses a button-triggered menu or simplified interaction for Storybook.

import { MantineReactTable, type MRT_ColumnDef } from '../../src';
import { Button } from '../../src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../src/components/ui/dropdown-menu';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { IconCopy, IconDotsVertical, IconDownload } from '@tabler/icons-react';

const meta: Meta = {
  title: 'Features/Cell Action Examples',
};

export default meta;

interface Row {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const baseColumns: MRT_ColumnDef<Row>[] = [
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
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data: Row[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const CellContextMenu = () => {
  const columns: MRT_ColumnDef<Row>[] = baseColumns.map((col) => ({
    ...col,
    Cell: (props) => {
      const v = props.cell.getValue();
      const text =
        v === null || v === undefined ? '' : String(v as string | number);
      return (
        <div className="group flex w-full max-w-full items-center justify-between gap-2">
          <span className="min-w-0 truncate">{text}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Cell actions"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                size="icon"
                type="button"
                variant="ghost"
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onSelect={() => {
                  void navigator.clipboard?.writeText(text);
                }}
              >
                <IconCopy className="size-4 shrink-0" />
                Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  console.info('download', text);
                }}
              >
                <IconDownload className="size-4 shrink-0" />
                Download to your device
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }));

  return <MantineReactTable columns={columns} data={data} />;
};
