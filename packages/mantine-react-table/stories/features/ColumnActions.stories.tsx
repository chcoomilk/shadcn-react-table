import { MantineReactTable, type MRT_ColumnDef } from '../../src';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../src/components/ui/dropdown-menu';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Column Action Examples',
};

export default meta;

interface Row {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const columns: MRT_ColumnDef<Row>[] = [
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

export const ColumnActionsEnabledDefault = () => (
  <MantineReactTable columns={columns} data={data} />
);

export const ColumnActionsDisabled = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableColumnActions={false}
  />
);

export const ColumnActionsDisabledPerColumn = () => (
  <MantineReactTable
    columns={[
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
        enableColumnActions: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: false,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const ColumnActionsEnabledPerColumn = () => (
  <MantineReactTable
    columns={[
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
        enableColumnActions: true,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
    enableColumnActions={false}
  />
);

export const CustomColumnActions = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    renderColumnActionsMenuItems={() => (
      <>
        <DropdownMenuItem onSelect={() => {}}>Item 1</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Item 2</DropdownMenuItem>
      </>
    )}
  />
);

export const CustomColumnActionsPerColumn = () => (
  <MantineReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        renderColumnActionsMenuItems: () => (
          <>
            <DropdownMenuItem onSelect={() => {}}>Item 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>Item 2</DropdownMenuItem>
          </>
        ),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        renderColumnActionsMenuItems: () => (
          <>
            <DropdownMenuItem onSelect={() => {}}>Item 2</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>Item 3</DropdownMenuItem>
          </>
        ),
      },
      {
        accessorKey: 'address',
        enableColumnActions: true,
        header: 'Address',
        renderColumnActionsMenuItems: ({ internalColumnMenuItems }) => (
          <>
            {internalColumnMenuItems}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => {}}>Item 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>Item 2</DropdownMenuItem>
          </>
        ),
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);
