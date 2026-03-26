import { MantineReactTable, type MRT_ColumnDef } from '../../src';
import { Button } from '../../src/components/ui/button';
import { DropdownMenuItem } from '../../src/components/ui/dropdown-menu';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { IconShare, IconTrash, IconUser } from '@tabler/icons-react';

const meta: Meta = {
  title: 'Features/Row Actions Examples',
};

export default meta;

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

const rowMenu = (row: (typeof data)[0]) => (
  <>
    <DropdownMenuItem
      onSelect={() => {
        console.info('View Profile', row);
      }}
    >
      <span className="flex items-center gap-2">
        <IconUser className="size-4 shrink-0" />
        View Profile
      </span>
    </DropdownMenuItem>
    <DropdownMenuItem
      onSelect={() => {
        console.info('Remove', row);
      }}
    >
      <span className="flex items-center gap-2">
        <IconTrash className="size-4 shrink-0" />
        Remove
      </span>
    </DropdownMenuItem>
    <DropdownMenuItem
      onSelect={() => {
        console.info('Share', row);
      }}
    >
      <span className="flex items-center gap-2">
        <IconShare className="size-4 shrink-0" />
        Share
      </span>
    </DropdownMenuItem>
  </>
);

export const RowActionsEnabled = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={({ row }) => rowMenu(row.original)}
  />
);

export const RowActionsAndEditingEnabled = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ row }) => rowMenu(row.original)}
  />
);

export const RowActionsLastColumn = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowActions
    initialState={{ density: 'xs' }}
    positionActionsColumn="last"
    renderRowActionMenuItems={({ row }) => rowMenu(row.original)}
  />
);

export const CustomRowActionButtons = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActions={({ row }) => (
      <div className="flex flex-nowrap gap-2">
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
          size="sm"
          variant="secondary"
        >
          View
        </Button>
        <Button
          onClick={() => {
            console.info('Remove', row);
          }}
          size="sm"
          variant="destructive"
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const CustomRowActionButtonsLastColumn = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowActions
    positionActionsColumn="last"
    renderRowActions={({ row }) => (
      <div className="flex flex-nowrap gap-2">
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
          size="sm"
          variant="secondary"
        >
          View
        </Button>
        <Button
          onClick={() => {
            console.info('Remove', row);
          }}
          size="sm"
          variant="destructive"
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const RowActionsWithVirtualization = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowActions
    enableRowVirtualization
    renderRowActionMenuItems={({ row }) => rowMenu(row.original)}
  />
);

export const RowActionsLastWithColumnOrdering = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowActions
    positionActionsColumn="last"
    renderRowActionMenuItems={({ row }) => rowMenu(row.original)}
  />
);
