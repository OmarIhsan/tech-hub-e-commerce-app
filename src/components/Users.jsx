import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Pagination,
  Stack,
} from '@mui/material';
import { Person, Edit, Delete } from '@mui/icons-material';
import { usersAPI } from '../api/usersAPI';
import { UserTableSkeleton } from './SkeletonLoader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ page, limit: itemsPerPage });
      const data = response.data;
      
      // Handle different response structures
      let usersData, totalCount;
      
      if (data.data && data.data.data) {
        // Nested structure: response.data.data.data
        usersData = data.data.data;
        totalCount = data.data.total || data.data.count || usersData.length;
      } else if (data.data) {
        // Structure: response.data.data
        usersData = data.data;
        totalCount = data.total || data.count || usersData.length;
      } else {
        // Structure: response.data
        usersData = data;
        totalCount = usersData.length;
      }

      setUsers(Array.isArray(usersData) ? usersData : []);
      setTotalCount(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      showSnackbar('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    if (!editingUser?.id) {
      showSnackbar('Invalid user data', 'error');
      return;
    }
    
    try {
      await usersAPI.update(editingUser.id, formData);
      showSnackbar('User updated successfully');
      fetchUsers(currentPage);
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar(`Error updating user: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showSnackbar('Invalid user ID', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        showSnackbar('User deleted successfully');
        
        // If we're on the last page and it becomes empty, go to previous page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers(currentPage);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar(`Error deleting user: ${error.response?.data?.message || error.message}`, 'error');
      }
    }
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <UserTableSkeleton rows={5} />;
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' gutterBottom>
          User Management ({totalCount} users)
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name || 'No name'}</TableCell>
                    <TableCell>{user.email || 'No email'}</TableCell>
                    <TableCell>{user.role || 'No role'}</TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'No date'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <Typography variant="body1" sx={{ py: 3 }}>
                      {loading ? 'Loading users...' : 'No users found in the system.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing page {currentPage} of {totalPages} ({totalCount} total users)
            </Typography>
          </Stack>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                Update
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Users;
