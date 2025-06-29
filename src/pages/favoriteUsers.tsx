import './users.css';

import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { PageContainer } from '@toolpad/core/PageContainer';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import UserDetailsForm from '../components/userDetailsForm';
import { useFavoriteUsers } from '../context/favoriteUsers';
import type { User } from '../types/json-placeholder-data';

const columnsSettings: MRT_ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Full Name',
    size: 150,
    enableColumnFilter: true,
    enableSorting: true,
    enableColumnActions: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 150,
    enableColumnFilter: true,
    enableSorting: true,
    enableColumnActions: false,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    size: 150,
    enableColumnFilter: false,
    enableSorting: false,
    enableColumnActions: false,
  },
  {
    accessorKey: 'company.name',
    header: 'Company',
    size: 150,
    enableColumnFilter: false,
    enableSorting: false,
    enableColumnActions: false,
  },
];

const FavoriteUsersPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    favorites,
    isLoading,
    isError,
    error,
    refetchFavorites,
    toggleFavorite,
    isFavorite,
  } = useFavoriteUsers();

  useEffect(() => {
    if (userId) {
      const user = favorites?.find((user) => user.id === Number(userId));
      setSelectedUser(user || null);
    }
  }, [userId, favorites]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => columnsSettings,
    []
  );

  const handleDelete = useCallback((row: any) => {
    // Remove from favorites instead of deleting
    toggleFavorite(row.original.id);
  }, [toggleFavorite]);

  const table = useMaterialReactTable({
    columns,
    data: favorites ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: error?.message || 'Error loading favorite users',
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Favorites">
        <IconButton onClick={() => refetchFavorites()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row, table }) => (
      <Box className="mrt-row-actions" sx={{ display: 'inline-flex', gap: '8px' }}>
        <IconButton
          color="primary"
          onClick={() => {
            navigate(`/favorite-users/${row.original.id}`);
            setSelectedUser(row.original);
          }}
        >
          <EyeIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDelete(row)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isLoading,
    },
  });

  return (
    <PageContainer>
      <Box sx={{ width: '100%' }} className="mrt-table">
        <MaterialReactTable table={table} />
      </Box>
      {selectedUser && (
        <UserDetailsForm 
          open={!!selectedUser} 
          onClose={() => {
            setSelectedUser(null);
            navigate('/favorite-users');
          }} 
          user={selectedUser} 
        />
      )}
    </PageContainer>
  );
};

export default FavoriteUsersPage;