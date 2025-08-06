# Thursday Assignment: React E-Commerce App (Auth + Products)

Build a simplified e-commerce application with authentication and product catalog functionality using React and Vite.

## Assignment Overview

Create a React application that allows users to:

1. **Authentication**: Register, login, and logout
2. **Product Catalog**: View products, search, and browse by categories
3. **Basic UI**: Responsive design with proper navigation

## Required Features

### Authentication System

- [ ] User registration form (email, password, name)
- [ ] Login form with validation
- [ ] Logout functionality
- [ ] Protected routes for authenticated features
- [ ] Public routes for guest access to products
- [ ] JWT token management
- [ ] User profile display in navigation

### Product Catalog

- [ ] **Public Products**: Browse products without login (guest access)
- [ ] **Protected Products**: Full product management for logged-in users
- [ ] Display list of products with images, names, and prices
- [ ] Search functionality
- [ ] Category filtering
- [ ] Product detail view (click to see full details)
- [ ] Responsive grid layout
- [ ] Loading states

### Navigation & UI

- [ ] Navigation bar with login/logout status
- [ ] Home page with welcome message
- [ ] Proper routing between pages
- [ ] Error handling for API calls
- [ ] Clean, professional design

## Project Structure

Organize your code using this structure:

```
src/
├── api/                    # API functions
│   ├── authAPI.js         # Authentication endpoints
│   └── productsAPI.js     # Product catalog endpoints
├── components/            # React components
│   ├── Login.jsx          # Login form
│   ├── Register.jsx       # Registration form
│   ├── Navigation.jsx     # Navigation bar
│   ├── Products.jsx       # Product listing (public access)
│   ├── ProductDetails.jsx # Individual product view
│   ├── ProtectedRoute.jsx # Route protection
│   └── PublicRoute.jsx    # Public route handling
├── config/                # Configuration
│   └── axios.js           # HTTP client setup
├── context/               # State management
│   └── AuthContext.jsx    # Authentication state
├── App.jsx               # Main application
└── main.jsx              # Entry point
```

## Technical Requirements

### Technologies to Use

- **React 18+** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Material-UI** or **Tailwind CSS** - Styling
- **Axios** - HTTP requests
- **React Context** - State management

### Code Quality

- Clean, readable code with proper naming
- Component-based architecture
- Proper error handling
- Loading states for API calls
- Responsive design
- Form validation

## Getting Started

1. **Initialize Project**

   ```bash
   npm create vite@latest my-store-app -- --template react
   cd my-store-app
   npm install
   ```

2. **Install Dependencies**

   ```bash
   npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material
   ```

3. **Implementation Steps**
   - Set up project structure as shown above
   - Create public product browsing (guest access)
   - Create authentication system (login/register)
   - Add protected routes and features
   - Add navigation and routing
   - Style with Material-UI or Tailwind

## Bonus Features

- User profile management
- Product favorites/wishlist
- Advanced search filters
- Loading Skeleton effect
- Dark/light theme toggle
