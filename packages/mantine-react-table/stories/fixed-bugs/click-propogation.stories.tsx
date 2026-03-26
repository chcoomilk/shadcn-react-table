import type { MouseEvent } from 'react';

import { MantineReactTable, type MRT_ColumnDef } from '../../src';
import { Button } from '../../src/components/ui/button';
import { DropdownMenuItem } from '../../src/components/ui/dropdown-menu';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { IconSend, IconUserCircle } from '@tabler/icons-react';

const meta: Meta = {
  title: 'Fixed Bugs/Click Propagation',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

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
  {
    accessorKey: 'state',
    header: 'State',
  },
];

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowClickAndRowMenuActions = () => {
  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      mantineTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActionMenuItems={() => (
        <>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="flex items-center gap-2">
              <IconUserCircle className="size-4 shrink-0" />
              View Profile
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <span className="flex items-center gap-2">
              <IconSend className="size-4 shrink-0" />
              Send Email
            </span>
          </DropdownMenuItem>
        </>
      )}
    />
  );
};

export const RowClickAndRowButtonctions = () => {
  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      mantineTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActions={() => (
        <Button
          onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
          size="sm"
          type="button"
          variant="secondary"
        >
          Test
        </Button>
      )}
    />
  );
};
