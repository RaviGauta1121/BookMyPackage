// ==================== src/App.tsx ====================
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Home } from './pages/Home';
import { Packages } from './pages/Packages';
import { PackageDetails } from './pages/PackageDetails';
import { Bookings } from './pages/Bookings';
import { Dashboard } from './pages/Dashboard';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { CreatePackage } from './components/packages/CreatePackage';

import { ROUTES, USER_ROLES } from './utils/constants';
import { AdminLogin } from './pages/AdminLogin';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.PACKAGES} element={<Packages />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/create-package" element={<CreatePackage />} />

                
                <Route
                  path={ROUTES.BOOKINGS}
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path={ROUTES.CREATE_PACKAGE}
                  element={
                    <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                      <CreatePackage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
          
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              borderRadius: '8px',
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;