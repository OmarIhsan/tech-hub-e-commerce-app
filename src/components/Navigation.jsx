import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Badge,
} from '@mui/material';
import { ShoppingCart, Person, Logout, DarkMode, LightMode } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import techHubLight from '../assets/techhub-light.png';
import techHubDark from '../assets/techhub-dark.png';
import MaterialUISwitch from './MaterialUISwitch';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={darkMode ? techHubLight : techHubDark} 
            alt="TechHub Logo" 
            style={{ 
              height: '40px', 
              marginRight: '12px',
              cursor: 'pointer'
            }}
            onClick={() => user && navigate('/products')}
          />
          <Typography variant="h6">
            E-Commerce App
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MaterialUISwitch 
            checked={darkMode}
            onChange={toggleDarkMode}
            inputProps={{ 'aria-label': 'dark mode switch' }}
          />
          
          {user && (
            <>
              <Button color="inherit" component={Link} to="/products">
                Products
              </Button>
              
              <Button color="inherit" component={Link} to="/users">
                <Person sx={{ mr: 1 }} />
                Users
              </Button>
              
              <Button color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCart />
                </Badge>
              </Button>
              
              <Button color="inherit" onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;