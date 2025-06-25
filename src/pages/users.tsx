import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useFetchUsers } from '../data/useFetchUsers';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { User } from '../types/json-placeholder-data';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Button } from '@mui/material';

const Example = () => {
  const { 
    data, 
    isError, 
    isRefetching, 
    isLoading, 
    refetch, 
    columnFilters, 
    setColumnFilters, 
    globalFilter, 
    setGlobalFilter, 
    sorting, 
    setSorting, 
    isBroken,
    setIsBroken,
  } = useFetchUsers();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Full Name',
        size: 150,
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        size: 200,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: 'company.name',
        header: 'Company',
        size: 150,
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <>
    <PageContainer>
      <Button onClick={() => setIsBroken(!isBroken)}>{isBroken ? 'Fix' : 'Break'} the data</Button>
      <MaterialReactTable table={table} />
    </PageContainer>
  </>;
};

export default Example;