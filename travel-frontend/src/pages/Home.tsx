// ==================== src/pages/Home.tsx ====================
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from '@mui/material';

import {
  Flight,
  Security,
  Support,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PackageService } from '../services/packageService';
import { useApi } from '../hooks/useApi';
import PackageList from '../components/packages/PackageList';
import { ROUTES } from '../utils/constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: packages, loading, error, refetch } = useApi(
    () => PackageService.getActivePackages().then(packages => packages.slice(0, 6)),
    []
  );

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6,
          mt: 4,
        }}
      >
        <Flight sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Discover Amazing Destinations
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Explore the world with our carefully curated travel packages
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(ROUTES.PACKAGES)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
            px: 4,
            py: 1.5,
          }}
        >
          Browse All Packages
        </Button>
      </Box>

      {/* Featured Packages */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Travel Packages
        </Typography>
        <PackageList
          packages={packages || []}
          loading={loading}
          error={error}
          onPackagesChange={refetch}
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 5 }}>
          Why Choose Us?
        </Typography>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 4 
          }}
        >
          <Card sx={{ textAlign: 'center', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Safe and secure payment processing for your peace of mind
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ textAlign: 'center', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Support sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Round-the-clock customer support for all your travel needs
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ textAlign: 'center', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Best Prices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Competitive pricing with no hidden fees or charges
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};