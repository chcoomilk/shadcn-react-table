import {
  MantineReactTable,
  type MRT_ColumnDef,
  MRT_ToggleFullScreenButton,
} from '../../src';
import { Button } from '../../src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/ui/tooltip';

import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { IconPlus, IconTrash } from '@tabler/icons-react';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
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
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
}));

export const ToolbarEnabledDefault = () => (
  <MantineReactTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    renderToolbarInternalActions={({ table }) => {
      return (
        <>
          <MRT_ToggleFullScreenButton table={table} />
        </>
      );
    }}
  />
);

export const TableTitle = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h3 className="text-lg font-semibold">Table Title</h3>;
    }}
  />
);

export const CustomTopToolbarActions = () => (
  <TooltipProvider>
    <MantineReactTable
      columns={columns}
      data={data}
      enableRowSelection
      renderTopToolbarCustomActions={() => {
        const handleCreateNewUser = () => {
          prompt('Create new user modal');
        };

        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Create New User"
                  onClick={handleCreateNewUser}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <IconPlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
          </div>
        );
      }}
    />
  </TooltipProvider>
);

export const CustomBottomToolbarActions = () => (
  <TooltipProvider>
    <MantineReactTable
      columns={columns}
      data={data}
      enableRowSelection
      renderBottomToolbarCustomActions={() => {
        const handleCreateNewUser = () => {
          prompt('Create new user modal');
        };

        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Create New User"
                  onClick={handleCreateNewUser}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <IconPlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
          </div>
        );
      }}
    />
  </TooltipProvider>
);

export const CustomTopToolbarSelectionActions = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            size="sm"
            type="button"
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            size="sm"
            type="button"
            variant="secondary"
          >
            Activate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            size="sm"
            type="button"
            variant="default"
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            size="sm"
            type="button"
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            size="sm"
            type="button"
            variant="secondary"
          >
            Activate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            size="sm"
            type="button"
            variant="default"
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom = () => (
  <TooltipProvider>
    <MantineReactTable
      columns={columns}
      data={data}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) => {
        const handleCreateNewUser = () => {
          prompt('Create new user modal');
        };
        const handleRemoveUsers = () => {
          confirm('Are you sure you want to remove the selected users?');
        };

        return (
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Create New User"
                  onClick={handleCreateNewUser}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <IconPlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    aria-label="Remove Users"
                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                    onClick={handleRemoveUsers}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Remove Users</TooltipContent>
            </Tooltip>
          </div>
        );
      }}
    />
  </TooltipProvider>
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <TooltipProvider>
    <MantineReactTable
      columns={columns}
      data={data}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderBottomToolbarCustomActions={({ table }) => {
        const handleCreateNewUser = () => {
          prompt('Create new user modal');
        };
        const handleRemoveUsers = () => {
          confirm('Are you sure you want to remove the selected users?');
        };

        return (
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Create New User"
                  onClick={handleCreateNewUser}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <IconPlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create New User</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    aria-label="Remove Users"
                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                    onClick={handleRemoveUsers}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Remove Users</TooltipContent>
            </Tooltip>
          </div>
        );
      }}
    />
  </TooltipProvider>
);

export const renderCustomTopToolbar = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    renderTopToolbar={() => (
      <div className="p-8">Custom Top Toolbar</div>
    )}
  />
);

export const renderCustomBottomToolbar = () => (
  <MantineReactTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => (
      <div className="p-8">Custom Bottom Toolbar</div>
    )}
  />
);
