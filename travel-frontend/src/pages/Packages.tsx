// ==================== src/pages/Packages.tsx ====================
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PackageService } from '../services/packageService';
import { useApi } from '../hooks/useApi';
import PackageList from '../components/packages/PackageList'; // Fixed: default import
import { SearchPackages } from '../components/packages/SearchPackages';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../utils/constants';
import { PackageSearchParams } from '../types/package';

export const Packages: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<PackageSearchParams>({});
  const [isSearching, setIsSearching] = useState(false);

  const { data: packages, loading, error, refetch } = useApi(
    () => PackageService.getActivePackages(),
    []
  );

  const { data: searchResults, loading: searchLoading } = useApi(
    () => PackageService.searchPackages(searchParams),
    [searchParams]
  );

  const handleSearch = async (params: PackageSearchParams) => {
    setSearchParams(params);
    setIsSearching(Object.keys(params).length > 0);
  };

  const displayPackages = isSearching ? searchResults : packages;
  const displayLoading = isSearching ? searchLoading : loading;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Travel Packages
        </Typography>
        {user?.role === USER_ROLES.ADMIN && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.CREATE_PACKAGE)}
          >
            Add Package
          </Button>
        )}
      </Box>

      <SearchPackages onSearch={handleSearch} loading={displayLoading} />

      {isSearching && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {searchResults?.length || 0} package(s) found
          </Typography>
        </Box>
      )}

      <PackageList
        packages={displayPackages || []}
        loading={displayLoading}
        error={error}
        onPackagesChange={refetch}
      />

      {/* Floating Action Button for Mobile */}
      {user?.role === USER_ROLES.ADMIN && (
        <Fab
          color="primary"
          aria-label="add package"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
          onClick={() => navigate(ROUTES.CREATE_PACKAGE)}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
};