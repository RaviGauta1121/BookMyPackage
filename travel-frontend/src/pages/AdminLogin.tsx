import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  Chip,
} from '@mui/material';
import { useAuth } from '../../src/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Default admin credentials
const ADMIN_CREDENTIALS = {
  name: "Admin",
  email: "admin@travel.com",
  password: "admin123",
  role: "admin"
};

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState(ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.password);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default fallback routes
  const from = location.state?.from?.pathname || '/';

  // Auto-fill admin credentials on component mount
  useEffect(() => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Use the same login function from AuthContext
      await login(email, password);
      
      // Navigate to admin dashboard or home
      navigate(from, { replace: true });
    } catch (error: any) {
      setError('Invalid admin credentials or access denied');
    }
  };

  const handleAutoLogin = async () => {
    setError('');
    
    try {
      // Automatically login with default admin credentials
      await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
      navigate(from, { replace: true });
    } catch (error: any) {
      setError('Admin auto-login failed');
    }
  };

  const handleUserLogin = () => {
    // Navigate to regular login page - adjust path as needed
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Portal
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Administrative Access Only
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip 
            label="Auto-filled Admin Credentials" 
            color="primary" 
            variant="outlined" 
            size="small"
          />
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            disabled={true}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            disabled={true}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Signing In...' : 'Admin Sign In'}
          </Button>
        </form>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleAutoLogin}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          Quick Admin Login
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Regular user?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={handleUserLogin}
            >
              User Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};