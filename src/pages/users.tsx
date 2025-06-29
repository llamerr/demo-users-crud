import './users.css';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { PageContainer } from '@toolpad/core/PageContainer';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import UserDetailsForm from '../components/userDetailsForm';
import { useFetchUsers } from '../data/useFetchUsers';
import type { User } from '../types/json-placeholder-data';

const columnsSettings = [
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
];

const Example = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  useEffect(() => {
    if (userId) {
      const user = data?.find((user) => user.id === Number(userId));
      setSelectedUser(user || null);
    }
  }, [userId, data]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => columnsSettings,
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/users/${row.original.id}`);
        setSelectedUser(row.original);
      },
      sx: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
    }),
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

  return (
    <PageContainer>
      <Button onClick={() => setIsBroken(!isBroken)}>{isBroken ? 'Fix' : 'Break'} the data</Button>
      <Box sx={{ width: '100%' }} className="mrt-table">
        <MaterialReactTable table={table} />
      </Box>
      <UserDetailsForm 
        open={!!selectedUser} 
        onClose={() => {
          setSelectedUser(null);
          navigate('/users');
        }} 
        user={selectedUser} 
      />
    </PageContainer>
  );
};

export default Example;