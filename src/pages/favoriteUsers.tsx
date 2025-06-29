import './favoriteUsers.css';

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
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const {
    favorites,
    isLoading,
    isError,
    error,
    refetchFavorites,
    toggleFavorite,
    isFavorite,
  } = useFavoriteUsers();

  const handleViewUser = useCallback((userId: number) => {
    navigate(`/favorite-users/${userId}`);
  }, [navigate]);

  const handleCloseUserDetails = useCallback(() => {
    navigate('/favorite-users');
  }, [navigate]);

  const handleSaveUser = useCallback((updatedUser: User) => {
    // In a real app, you would update the user data here
    console.log('Saving user:', updatedUser);
    // For now, just close the dialog
    handleCloseUserDetails();
  }, [handleCloseUserDetails]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      ...columnsSettings,
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: '8px' }} className="mrt-row-actions">
            <Tooltip title="View details">
              <IconButton
                color="primary"
                onClick={() => handleViewUser(row.original.id)}
              >
                <EyeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove from favorites">
              <IconButton
                color="error"
                onClick={() => toggleFavorite(row.original.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleViewUser, toggleFavorite]
  );

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
      <Box>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refetchFavorites()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading,
      showAlertBanner: isError,
    },
  });

  return (
    <PageContainer>
      <Box sx={{ width: '100%' }} className="mrt-table">
        <MaterialReactTable table={table} />
      </Box>
      
      {/* User Details Dialog */}
      <UserDetailsForm
        open={!!userId}
        onClose={handleCloseUserDetails}
        userId={userId ? parseInt(userId, 10) : undefined}
        readOnly={true}
        onSave={handleSaveUser}
      />
    </PageContainer>
  );
};

export default FavoriteUsersPage;