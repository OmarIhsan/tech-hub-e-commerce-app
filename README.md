# E-Commerce Project

A modern e-commerce application built with React and Vite, featuring a complete product catalog, shopping cart, user management, and admin panel.

## Project Structure

```
src/
├── api/                    # API layer - Domain-specific API functions
│   ├── authAPI.js         # Authentication & authorization endpoints
│   ├── cartAPI.js         # Shopping cart management endpoints
│   ├── categoriesAPI.js   # Product categories management
│   ├── orderItemsAPI.js   # Order items management
│   ├── ordersAPI.js       # Order management & processing
│   ├── paymentsAPI.js     # Payment processing endpoints
│   ├── productImagesAPI.js # Product image management
│   ├── productsAPI.js     # Product catalog & management
│   ├── reviewsAPI.js      # Product reviews & ratings
│   ├── shippingAddressesAPI.js # User shipping addresses
│   ├── usersAPI.js        # User management endpoints
│   └── wishlistAPI.js     # User wishlist management
├── assets/                # Static assets (images, icons, etc.)
│   ├── techhub-dark.png   # Dark theme logo
│   └── techhub-light.png  # Light theme logo
├── components/            # Reusable React components
│   ├── AdminCategories.jsx    # Category management for admins
│   ├── AdminProducts.jsx      # Product management for admins
│   ├── AdminRoute.jsx         # Admin-only route protection
│   ├── Cart.jsx              # Shopping cart interface
│   ├── Checkout.jsx          # Checkout process & payment
│   ├── ErrorBoundary.jsx     # Error handling wrapper
│   ├── ImageWithFallback.jsx # Image component with fallback
│   ├── Login.jsx             # User authentication form
│   ├── Navigation.jsx        # Main navigation bar
│   ├── ProductDetails.jsx    # Individual product view
│   ├── Products.jsx          # Product listing & catalog
│   ├── ProtectedRoute.jsx    # Authenticated user route protection
│   ├── PublicRoute.jsx       # Public route handling
│   ├── SkeletonLoader.jsx    # Loading state components
│   └── Users.jsx             # User management interface
├── config/                # Application configuration
│   └── axios.js           # HTTP client configuration & interceptors
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   └── ThemeContext.jsx   # Theme switching (light/dark mode)
├── utils/                 # Utility functions & helpers
├── App.jsx               # Main application component
├── App.css              # Global application styles
├── index.css            # Base CSS styles
└── main.jsx             # Application entry point
```

## Directory Explanations

### `/api` - API Layer
Contains domain-specific API functions organized by business logic. Each file handles HTTP requests for a specific domain (auth, products, cart, etc.). This separation provides:
- Better maintainability
- Clear separation of concerns
- Easy testing and mocking
- Reusable API functions

### `/components` - UI Components
React components organized by functionality. Includes both feature-specific components (Cart, Products) and utility components (ErrorBoundary, SkeletonLoader).

### `/config` - Configuration Files
Application-level configuration including:
- HTTP client setup (axios configuration)
- API base URLs and interceptors
- Authentication token handling

### `/context` - State Management
React Context providers for global state management:
- Authentication state
- Theme preferences
- Other app-wide state

### `/assets` - Static Resources
Images, icons, and other static files used throughout the application.

### `/utils` - Utility Functions
Helper functions and utilities that can be used across components.

## Getting Started

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Material-UI** - UI component library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **ESLint** - Code linting

## Development

### Adding New API Endpoints
1. Add functions to the appropriate API file in `/api`
2. Follow the existing patterns for error handling
3. Update components to use the new API functions

### Adding New Components
1. Create components in `/components`
2. Follow the existing naming conventions
3. Use Material-UI components for consistency
4. Include proper prop types and error handling

### State Management
- Use React Context for global state
- Keep component-level state for local UI state
- Use the AuthContext for authentication state