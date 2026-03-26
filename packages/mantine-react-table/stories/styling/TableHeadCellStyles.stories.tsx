import { MantineReactTable, type MRT_ColumnDef } from '../../src';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Style Table Head Cells',
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
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];
const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTableHeadCellStyles = () => (
  <MantineReactTable columns={columns} data={data} />
);

export const StyleAllMantineTableHeadCell = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    mantineTableHeadCellProps={{
      style: {
        backgroundColor: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
        color: '#fff',
      },
    }}
  />
);

export const StyleTableHeadCellsIndividually = () => (
  <MantineReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        mantineTableHeadCellProps: {
          style: { color: 'hsl(var(--primary))' },
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        mantineTableHeadCellProps: {
          style: {
            color: 'red',
          },
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomHeadCellRenders = () => (
  <MantineReactTable
    columns={[
      {
        accessorKey: 'firstName',
        Header: <em>First Name</em>,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        Header: () => <em>Last Name</em>,
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        Header: ({ column }) => (
          <span className="font-medium text-primary">
            {column.columnDef.header}
          </span>
        ),
        header: 'Current Age',
      },
      {
        accessorKey: 'address',
        header: 'Address of Residence (Permanent)',
      },
    ]}
    data={data}
    enableColumnResizing
  />
);
