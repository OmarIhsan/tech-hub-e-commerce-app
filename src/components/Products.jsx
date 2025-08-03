import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  Stack,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { productsAPI, cartAPI } from '../services/api';
import { ProductsGridSkeleton } from './SkeletonLoader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [view, setView] = useState('module');

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm && Array.isArray(products)) {
      const filtered = products.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(Array.isArray(products) ? products : []);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const products = response.data.data || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      const fallbackProducts = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${i + 1}`,
        description: `This is a sample product description for product ${i + 1}.`
      }));
      setProducts(fallbackProducts);
      setFilteredProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      await cartAPI.add(product.id, 1);
      // Fallback to localStorage for immediate UI updates
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage only
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / productsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <ProductsGridSkeleton count={6} />;
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Products ({filteredProducts.length} items)
          </Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            aria-label="view mode"
          >
            <ToggleButton value="module" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          fullWidth
          label='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            view === 'module' ? (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{
                  height: '100%',
                  width: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                  },
                  transition: 'box-shadow 0.3s ease-in-out',
                }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                    image={product.image}
                    alt={product.title}
                  />
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    p: 2
                  }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title.length > 50
                        ? `${product.title.substring(0, 50)}...`
                        : product.title}
                    </Typography>

                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1, alignSelf: 'flex-start' }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ) : (
              <Grid item xs={12} key={product.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  '&:hover': {
                    boxShadow: 6,
                  },
                  transition: 'box-shadow 0.3s ease-in-out',
                }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', sm: 300 },
                      height: { xs: 200, sm: 250 },
                      objectFit: 'cover'
                    }}
                    image={product.image}
                    alt={product.title}
                  />
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    p: 3
                  }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>

                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1, alignSelf: 'flex-start' }}
                    />

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" color="primary">
                        ${product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}
                        size="large"
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )

          ))}
        </Grid>
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
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts?.length || 0)} of{' '}
              {filteredProducts?.length || 0} products
            </Typography>
          </Stack>
        )}

        {(filteredProducts?.length || 0) === 0 && (
          <Typography variant='h6' align='center' sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;
