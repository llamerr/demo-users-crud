import './users.css';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Refresh as RefreshIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
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
import { useFetchUsers } from '../data/useFetchUsers';
import type { User } from '../types/json-placeholder-data';

const columnsSettings = [
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

const UsersPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { isFavorite, toggleFavorite } = useFavoriteUsers();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);

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

  const handleToggleFavorite = useCallback((userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(userId);
  }, [toggleFavorite]);

  const handleViewUser = useCallback((userId: number) => {
    setViewingUserId(userId);
    navigate(`/users/${userId}`);
  }, [navigate]);

  const handleEditUser = useCallback((userId: number) => {
    setEditingUserId(userId);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setViewingUserId(null);
    navigate('/users');
  }, [navigate]);

  const handleCloseEdit = useCallback(() => {
    setEditingUserId(null);
  }, []);

  const handleSaveUser = useCallback((updatedUser: User) => {
    // In a real app, you would update the user data here
    console.log('Updated user:', updatedUser);
    setEditingUserId(null);
  }, []);

  // Update URL when viewing user
  useEffect(() => {
    if (userId) {
      setViewingUserId(Number(userId));
    } else {
      setViewingUserId(null);
    }
  }, [userId]);

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
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button onClick={() => setIsBroken(!isBroken)}>{isBroken ? 'Fix' : 'Break'} the data</Button>
        <Button onClick={() => navigate('/users/new')}>Create new user</Button>
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box className="mrt-row-actions" sx={{ display: 'inline-flex', gap: '8px' }}>
        <Tooltip title="View details">
          <IconButton
            color="primary"
            onClick={() => handleViewUser(row.original.id)}
          >
            <EyeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit user">
          <IconButton
            color="secondary"
            onClick={() => handleEditUser(row.original.id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete user">
          <IconButton
            color="error"
            onClick={() => {
              // Handle delete
              console.log('Delete user:', row.original.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isFavorite(row.original.id) ? "Remove from favorites" : "Add to favorites"}>
          <IconButton
            color={isFavorite(row.original.id) ? "error" : "default"}
            onClick={(e) => handleToggleFavorite(row.original.id, e)}
          >
            {isFavorite(row.original.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
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
      <Box sx={{ width: '100%' }} className="mrt-table">
        <MaterialReactTable table={table} />
      </Box>
      
      {/* View User Dialog */}
      {viewingUserId && (
        <UserDetailsForm
          open={!!viewingUserId}
          onClose={handleCloseDetails}
          userId={viewingUserId}
          readOnly
        />
      )}

      {/* Edit User Dialog */}
      {editingUserId && (
        <UserDetailsForm
          open={!!editingUserId}
          onClose={handleCloseEdit}
          userId={editingUserId}
          onSave={handleSaveUser}
          readOnly={false}
        />
      )}
    </PageContainer>
  );
};

export default UsersPage;