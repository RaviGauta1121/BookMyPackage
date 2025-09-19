// ==================== src/components/packages/PackageList.tsx ====================
import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
} from '@mui/material';
import { Refresh, TravelExplore } from '@mui/icons-material';
import PackageCard from './PackageCard';

export interface TravelPackage {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  maxCapacity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface PackageListProps {
  packages: TravelPackage[];
  loading: boolean;
  error: string | null;
  onPackagesChange: () => Promise<void>;
}

const PackageList: React.FC<PackageListProps> = ({
  packages,
  loading,
  error,
  onPackagesChange,
}) => {
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 300,
          py: 8
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading travel packages...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={onPackagesChange}
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!packages?.length) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <TravelExplore 
          sx={{ 
            fontSize: 80, 
            color: 'text.disabled', 
            mb: 2 
          }} 
        />
        <Typography variant="h5" gutterBottom color="text.secondary">
          No Packages Available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check back later for new travel packages!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Available Packages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {packages.length} {packages.length === 1 ? 'package' : 'packages'} found
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}
      >
        {packages.map((pkg) => (
          <Box
            key={pkg.id}
            sx={{
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 12px)',
                lg: '1 1 calc(33.333% - 16px)',
              },
              minWidth: { xs: 300, sm: 280 },
              maxWidth: { xs: '100%', sm: 400 },
            }}
          >
            <PackageCard package={pkg} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PackageList;