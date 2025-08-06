import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Snackbar,
  Pagination,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { categoriesAPI } from '../api/categoriesAPI';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCategories = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAll({
          page,
          limit: itemsPerPage,
        });
        const data = response.data.data;

        // Handle different response structures
        if (data.data) {
          setCategories(Array.isArray(data.data) ? data.data : []);
          setTotalCount(data.total || data.data.length);
          setTotalPages(
            Math.ceil((data.total || data.data.length) / itemsPerPage)
          );
        } else {
          setCategories(Array.isArray(data) ? data : []);
          setTotalCount(data.length);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        showSnackbar('Error fetching categories', 'error');
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchCategories(currentPage);
  }, [fetchCategories, currentPage]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showSnackbar('Please enter a category name', 'error');
      return;
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
      };

      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, categoryData);
        showSnackbar('Category updated successfully');
      } else {
        await categoriesAPI.create(categoryData);
        showSnackbar('Category created successfully');
      }

      fetchCategories(currentPage);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      showSnackbar(
        `Error saving category: ${
          error.response?.data?.message || error.message
        }`,
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showSnackbar('Invalid category ID', 'error');
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
      )
    ) {
      try {
        await categoriesAPI.delete(id);
        showSnackbar('Category deleted successfully');

        // If we're on the last page and it becomes empty, go to previous page
        if (categories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchCategories(currentPage);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        showSnackbar(
          `Error deleting category: ${
            error.response?.data?.message || error.message
          }`,
          'error'
        );
      }
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading && categories.length === 0) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ my: 4 }}>
          <Typography variant='h4'>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant='h4'>
            Category Management ({totalCount} categories)
          </Typography>
          <Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Typography variant='body1'>
                        {category.name || 'No name'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : 'No date'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(category)}
                        color='primary'
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(category.id)}
                        color='error'
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align='center'>
                    <Typography variant='body1' sx={{ py: 3 }}>
                      {loading
                        ? 'Loading categories...'
                        : 'No categories found. Click "Add Category" to create your first category.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack spacing={2} alignItems='center' sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
              size='large'
              showFirstButton
              showLastButton
            />
            <Typography variant='body2' color='text.secondary'>
              Showing page {currentPage} of {totalPages} ({totalCount} total
              categories)
            </Typography>
          </Stack>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth='sm'
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name='name'
                    label='Category Name'
                    value={formData.name}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type='submit' variant='contained'>
                {editingCategory ? 'Update' : 'Create'}
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

export default AdminCategories;
