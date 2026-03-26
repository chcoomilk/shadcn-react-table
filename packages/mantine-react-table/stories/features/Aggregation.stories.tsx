import {
  MantineReactTable,
  MRT_AggregationFns,
  type MRT_ColumnDef,
} from '../../src';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Aggregation Examples',
};

export default meta;

const data = [...Array(2000)].map(() => ({
  age: faker.number.int({ max: 65, min: 18 }),
  firstName: faker.person.firstName(),
  gender: faker.person.sex(),
  lastName: faker.person.lastName(),
  salary: Number(faker.finance.amount({ dec: 0, max: 100000, min: 10000 })),
  state: faker.location.state(),
}));

const averageSalary =
  data.reduce((acc, curr) => acc + curr.salary, 0) / data.length;

const averageAge = data.reduce((acc, curr) => acc + curr.age, 0) / data.length;

const columns = [
  {
    accessorKey: 'firstName',
    enableGrouping: false,
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    enableGrouping: false,
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    AggregatedCell: ({ cell, table }) => (
      <>
        Max by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span className="font-bold text-green-600">
          {cell.getValue<number>()}
        </span>
      </>
    ),
    aggregationFn: 'max',
    Footer: () => (
      <div className="flex flex-col gap-1">
        Average Age:
        <span className="font-medium text-orange-500">
          {Math.round(averageAge)}
        </span>
      </div>
    ),
    header: 'Age',
  },
  {
    accessorKey: 'gender',
    GroupedCell: ({ cell }) => (
      <span className="font-medium text-primary">{cell.getValue<string>()}</span>
    ),
    header: 'Gender',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'salary',
    AggregatedCell: ({ cell, table }) => (
      <>
        Average by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span className="font-bold text-green-600">
          {cell.getValue<number>()?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </>
    ),
    aggregationFn: 'mean',
    Cell: ({ cell }) => (
      <>
        {cell.getValue<number>()?.toLocaleString?.('en-US', {
          currency: 'USD',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          style: 'currency',
        })}
      </>
    ),
    enableGrouping: false,
    Footer: () => (
      <div className="flex flex-col gap-1">
        Average Salary:
        <span className="font-medium text-orange-500">
          {averageSalary?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </div>
    ),
    header: 'Salary',
  },
] as MRT_ColumnDef<(typeof data)[0]>[];

export const Aggregation = () => (
  <MantineReactTable columns={columns} data={data} enableGrouping />
);

export const AggregationExpandedDefault = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{ expanded: true }}
  />
);

export const AggregationGroupedAndExpandedDefault = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);

export const MultiAggregationPerColumn = () => (
  <MantineReactTable
    columns={[
      {
        accessorKey: 'firstName',
        enableGrouping: false,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        enableGrouping: false,
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        AggregatedCell: ({ cell, table }) => (
          <>
            Min by{' '}
            {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()[0]}
            </span>
            <br />
            Max by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()[1]}
            </span>
          </>
        ),
        //manually set multiple aggregation functions
        aggregationFn: (columnId, leafRows: any, childRows: any) => [
          MRT_AggregationFns.min(columnId, leafRows, childRows),
          MRT_AggregationFns.max(columnId, leafRows, childRows),
        ],
        Footer: () => (
          <div className="flex flex-col gap-1">
            Average Age:
            <span className="font-medium text-orange-500">
              {Math.round(averageAge)}
            </span>
          </div>
        ),
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        GroupedCell: ({ cell }) => (
          <span className="font-medium text-primary">{cell.getValue<string>()}</span>
        ),
        header: 'Gender',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'salary',
        AggregatedCell: ({ cell, table }) => (
          <>
            Count:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()?.[0]}
            </span>
            <br />
            Average by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span className="font-bold text-green-600">
              {cell
                .getValue<[number, number]>()?.[1]
                ?.toLocaleString?.('en-US', {
                  currency: 'USD',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  style: 'currency',
                })}
            </span>
          </>
        ),
        aggregationFn: ['count', 'mean'], //multiple aggregation functions
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>()?.toLocaleString?.('en-US', {
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              style: 'currency',
            })}
          </>
        ),
        enableGrouping: false,
        Footer: () => (
          <div className="flex flex-col gap-1">
            Average Salary:
            <span className="font-medium text-orange-500">
              {averageSalary?.toLocaleString?.('en-US', {
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
                style: 'currency',
              })}
            </span>
          </div>
        ),
        header: 'Salary',
      },
    ]}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);
