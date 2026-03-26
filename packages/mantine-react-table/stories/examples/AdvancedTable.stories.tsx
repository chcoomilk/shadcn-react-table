import {
    MantineReactTable,
    type MRT_ColumnDef,
    MRT_ShowHideColumnsButton,
    useMantineReactTable,
} from '../../src';

import { Button } from '../../src/components/ui/button';
import { TooltipProvider } from '../../src/components/ui/tooltip';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
    title: 'Examples/Advanced Table',
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

const data = [...Array(15)].map(() => ({
    address: faker.location.streetAddress(),
    age: faker.number.int(80),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
}));

export const AISearchIdentifiedListTable = () => {
    const table = useMantineReactTable({
        columns,
        data,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableColumnDragging: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        enableColumnResizing: true,
        enableRowNumbers: false,
        enableRowSelection: true,
        enableStickyHeader: true,
        enableTopToolbar: false,
        sortDescFirst: true,
    });

    return (
        <div className="flex flex-col gap-4 p-4 bg-background">
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="default">Epic tw btn</Button>
                <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                    <MRT_ShowHideColumnsButton table={table} variant="default" />
                </TooltipProvider>
            </div>
            <MantineReactTable table={table} />
        </div>
    );
};