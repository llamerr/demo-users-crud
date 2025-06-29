import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useFetchUser } from '../../data/useFetchUser';

export interface UserDetailsFormProps {
  open: boolean;
  onClose: () => void;
  userId?: number | null;
  loading?: boolean;
  readOnly?: boolean;
  onSave?: (user: any) => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const LoadingSkeleton = () => (
  <Box>
    {[...Array(6)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={56} sx={{ mb: 2 }} />
    ))}
    <Skeleton variant="rectangular" width={120} height={36} sx={{ ml: 'auto' }} />
  </Box>
);

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  open,
  onClose,
  userId,
  loading: externalLoading = false,
  readOnly = true,
  onSave,
}) => {
  const [editMode, setEditMode] = useState(!readOnly);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    company: '',
    city: '',
  });
  
  // Fetch user data when userId changes
  const { user, isLoading: isLoadingUser, isError } = useFetchUser(userId || undefined);
  const loading = externalLoading || isLoadingUser;

  // Initialize form data when user data is loaded or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        company: user.company?.name || '',
        city: user.address?.city || '',
      });
    } else {
      // Reset form when user is cleared
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        company: '',
        city: '',
      });
    }
  }, [user]);

  // Reset edit mode when opening/closing the form or when readOnly changes
  useEffect(() => {
    if (open) {
      setEditMode(!readOnly);
    }
  }, [open, readOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (onSave && user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        company: { ...user.company, name: formData.company },
        address: { ...user.address, city: formData.city },
      };
      onSave(updatedUser);
    }
  };

  if (!open) return null;

  const renderField = (label: string, name: string, type = 'text') => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={formData[name] ?? ''}
      onChange={handleInputChange}
      margin="normal"
      variant="outlined"
      disabled={!editMode || loading}
      type={type}
      InputLabelProps={type === 'email' ? { shrink: true } : undefined}
    />
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-details-modal"
      aria-describedby="user-details-modal-description"
    >
      <Paper sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {readOnly ? 'User Details' : 'Edit User'}
          </Typography>
          <Box>
            {!loading && !isError && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                size="small"
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
            )}
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" noValidate autoComplete="off">
          {loading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <Typography color="error" sx={{ my: 2 }}>
              Error loading user data. Please try again.
            </Typography>
          ) : (
            <>
              {renderField('Name', 'name')}
              {renderField('Username', 'username')}
              {renderField('Email', 'email', 'email')}
              {renderField('Phone', 'phone', 'tel')}
              {renderField('Website', 'website')}
              {renderField('Company', 'company')}
              {renderField('City', 'city')}
              
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                {editMode ? (
                  <>
                    <Button 
                      variant="outlined" 
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleSave}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={onClose}
                    disabled={loading}
                  >
                    Close
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default UserDetailsForm;