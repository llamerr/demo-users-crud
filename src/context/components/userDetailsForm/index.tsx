import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface UserDetailsFormProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    company: {
      name: string;
    };
    address: {
      city: string;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
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

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ open, onClose, user }) => {
  if (!user) return null;

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
            User Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Name"
            value={user.name || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <TextField
            fullWidth
            label="Username"
            value={user.username || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <TextField
            fullWidth
            label="Email"
            value={user.email || ''}
            margin="normal"
            variant="outlined"
            type="email"
            disabled
          />
          
          <TextField
            fullWidth
            label="Phone"
            value={user.phone || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <TextField
            fullWidth
            label="Website"
            value={user.website || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <TextField
            fullWidth
            label="Company"
            value={user.company?.name || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <TextField
            fullWidth
            label="City"
            value={user.address?.city || ''}
            margin="normal"
            variant="outlined"
            disabled
          />
          
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={onClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default UserDetailsForm;