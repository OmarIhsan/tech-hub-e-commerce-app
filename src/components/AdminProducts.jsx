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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Input,
  FormHelperText,
  Pagination,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';
import { productsAPI } from '../api/productsAPI';
import { categoriesAPI } from '../api/categoriesAPI';
import ImageWithFallback from './ImageWithFallback';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    categoryId: '',
    altText: ''
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ page, limit: itemsPerPage });
      const data = response.data;
      
      // Handle different response structures
      let productsData, totalCount;
      
      if (data.data && data.data.data) {
        // Nested structure: response.data.data.data
        productsData = data.data.data;
        totalCount = data.data.total || data.data.count || productsData.length;
      } else if (data.data) {
        // Structure: response.data.data
        productsData = data.data;
        totalCount = data.total || data.count || productsData.length;
      } else {
        // Structure: response.data
        productsData = data;
        totalCount = productsData.length;
      }

      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalCount(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      showSnackbar('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getAll();
      const data = response.data;
      
      console.log('Categories API response:', data);
      
      // Handle different response structures (same as products)
      let categoriesData;
      
      if (data.data && data.data.data) {
        // Nested structure: response.data.data.data
        categoriesData = data.data.data;
      } else if (data.data) {
        // Structure: response.data.data
        categoriesData = data.data;
      } else {
        // Structure: response.data
        categoriesData = data;
      }

      console.log('Parsed categories data:', categoriesData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      showSnackbar('Error loading categories. Please try refreshing the page.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [fetchProducts, fetchCategories, currentPage]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId || '',
        altText: product.altText || ''
      });
      setImagePreview(product.primaryImage || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        categoryId: '',
        altText: ''
      });
      setImagePreview(null);
    }
    setSelectedImage(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '',
      stock: '',
      categoryId: '',
      altText: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showSnackbar('Image size must be less than 5MB', 'error');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar('Only JPEG, PNG, and WebP images are allowed', 'error');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.categoryId) {
      showSnackbar('Please fill in all required fields (Name, Price, Category)', 'error');
      return;
    }

    if (!editingProduct && !selectedImage) {
      showSnackbar('Please select an image for the product', 'error');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId
      };

      let productResponse;
      if (editingProduct) {
        productResponse = await productsAPI.update(editingProduct.id, productData);
        showSnackbar('Product updated successfully');
      } else {
        productResponse = await productsAPI.create(productData);
        console.log('Product creation response:', productResponse.data);
        
        // Upload image for new product
        if (selectedImage) {
          // Extract product ID from response - handle different response structures
          let productId;
          const responseData = productResponse.data;
          
          if (responseData.data && responseData.data.id) {
            productId = responseData.data.id;
          } else if (responseData.id) {
            productId = responseData.id;
          } else {
            throw new Error('Product ID not found in response');
          }
          
          console.log('Using product ID for image upload:', productId);
          
          const imageFormData = new FormData();
          imageFormData.append('productId', productId);
          imageFormData.append('isPrimary', 'true');
          imageFormData.append('altText', formData.altText || formData.name);
          imageFormData.append('image', selectedImage);
          
          await productsAPI.uploadImage(imageFormData);
        }
        
        showSnackbar('Product created successfully');
      }
      
      fetchProducts(currentPage);  
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar(`Error saving product: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showSnackbar('Invalid product ID', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        showSnackbar('Product deleted successfully');
        
        // If we're on the last page and it becomes empty, go to previous page
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchProducts(currentPage);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar(`Error deleting product: ${error.response?.data?.message || error.message}`, 'error');
      }
    }
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Product Management ({totalCount} products)
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <ImageWithFallback
                        src={product.primaryImage}
                        alt={product.name}
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.name && product.name.length > 50
                          ? `${product.name.substring(0, 50)}...`
                          : product.name || 'No name'}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.categoryName || 'No category'}</TableCell>
                    <TableCell>${product.price || '0.00'}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(product)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      {loading ? 'Loading products...' : 'No products found. Click "Add Product" to create your first product.'}
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
              Showing page {currentPage} of {totalPages} ({totalCount} total products)
            </Typography>
          </Stack>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Product Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="price"
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name="discount"
                    label="Discount ($)"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name="stock"
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl required fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      label="Category"
                    >
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          No categories available. Please create categories first.
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="altText"
                    label="Image Alt Text (for accessibility)"
                    value={formData.altText}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Product Image {!editingProduct && '*'}
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ 
                        accept: "image/jpeg,image/png,image/webp",
                        required: !editingProduct 
                      }}
                      onChange={handleImageChange}
                      sx={{ mb: 2 }}
                    />
                    <FormHelperText>
                      Upload JPEG, PNG, or WebP image (max 5MB)
                    </FormHelperText>
                  </Box>
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Image Preview:
                      </Typography>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingProduct ? 'Update' : 'Create'}
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

export default AdminProducts;