import type { CSSProperties } from 'react';

import { MantineReactTable, type MRT_ColumnDef } from '../../src';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Theming',
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

export const DefaultTheme = () => (
  <MantineReactTable columns={columns} data={data} enableRowSelection />
);

/** Use the Storybook toolbar primary-color control or set `--primary` on a wrapper. */
export const CustomLightTheme = () => (
  <div
    className="rounded-md"
    style={
      {
        ['--primary' as string]: '330 81% 45%',
        ['--ring' as string]: '330 81% 45%',
      } as CSSProperties
    }
  >
    <MantineReactTable columns={columns} data={data} enableRowSelection />
  </div>
);

export const CustomDarkTheme = () => (
  <div className="dark rounded-md">
    <div
      style={
        {
          ['--primary' as string]: '330 81% 60%',
          ['--ring' as string]: '330 81% 60%',
        } as CSSProperties
      }
    >
      <MantineReactTable columns={columns} data={data} enableRowSelection />
    </div>
  </div>
);
