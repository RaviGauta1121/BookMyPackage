// ==================== src/components/packages/SearchPackages.tsx ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Collapse,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  LocationOn,
  AttachMoney,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { PackageSearchParams } from '../../types/package';

interface SearchPackagesProps {
  onSearch: (params: PackageSearchParams) => void;
  loading?: boolean;
}

// Named export (what you currently have)
export const SearchPackages: React.FC<SearchPackagesProps> = ({
  onSearch,
  loading = false,
}) => {
  const [searchParams, setSearchParams] = useState<PackageSearchParams>({
    destination: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [expanded, setExpanded] = useState(false);

  const handleInputChange = (field: keyof PackageSearchParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchParams(prev => ({
      ...prev,
      [field]: field === 'minPrice' || field === 'maxPrice' 
        ? value ? parseFloat(value) : undefined 
        : value
    }));
  };

  const handleSearch = () => {
    // Filter out empty values
    const filteredParams: PackageSearchParams = {};
    
    if (searchParams.destination?.trim()) {
      filteredParams.destination = searchParams.destination.trim();
    }
    
    if (searchParams.minPrice !== undefined && searchParams.minPrice > 0) {
      filteredParams.minPrice = searchParams.minPrice;
    }
    
    if (searchParams.maxPrice !== undefined && searchParams.maxPrice > 0) {
      filteredParams.maxPrice = searchParams.maxPrice;
    }

    onSearch(filteredParams);
  };

  const handleClear = () => {
    const clearedParams = {
      destination: '',
      minPrice: undefined,
      maxPrice: undefined,
    };
    setSearchParams(clearedParams);
    onSearch({});
  };

  const hasActiveFilters = () => {
    return !!(
      searchParams.destination?.trim() ||
      (searchParams.minPrice !== undefined && searchParams.minPrice > 0) ||
      (searchParams.maxPrice !== undefined && searchParams.maxPrice > 0)
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Search Packages
        </Typography>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{ ml: 1 }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Basic Search - Using Stack instead of Grid */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2} 
        alignItems="stretch"
      >
        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <TextField
            fullWidth
            label="Destination"
            value={searchParams.destination}
            onChange={handleInputChange('destination')}
            onKeyPress={handleKeyPress}
            placeholder="Search by destination..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ flex: '0 0 140px' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={<Search />}
            sx={{ height: 56 }}
          >
            Search
          </Button>
        </Box>

        <Box sx={{ flex: '0 0 140px' }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClear}
            disabled={loading}
            startIcon={<Clear />}
            sx={{ height: 56 }}
          >
            Clear
          </Button>
        </Box>

        <Box sx={{ flex: '0 0 120px' }}>
          <Button
            fullWidth
            variant="text"
            onClick={() => setExpanded(!expanded)}
            startIcon={<FilterList />}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ height: 56 }}
          >
            Filters
          </Button>
        </Box>
      </Stack>

      {/* Advanced Filters */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Price Range
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="min-price-input">Minimum Price</InputLabel>
                <OutlinedInput
                  id="min-price-input"
                  type="number"
                  value={searchParams.minPrice || ''}
                  onChange={handleInputChange('minPrice')}
                  onKeyPress={handleKeyPress}
                  startAdornment={
                    <InputAdornment position="start">
                      <AttachMoney color="primary" />
                    </InputAdornment>
                  }
                  label="Minimum Price"
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="0.00"
                />
              </FormControl>
            </Box>

            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="max-price-input">Maximum Price</InputLabel>
                <OutlinedInput
                  id="max-price-input"
                  type="number"
                  value={searchParams.maxPrice || ''}
                  onChange={handleInputChange('maxPrice')}
                  onKeyPress={handleKeyPress}
                  startAdornment={
                    <InputAdornment position="start">
                      <AttachMoney color="primary" />
                    </InputAdornment>
                  }
                  label="Maximum Price"
                  inputProps={{ 
                    min: searchParams.minPrice || 0, 
                    step: 0.01 
                  }}
                  placeholder="0.00"
                />
              </FormControl>
            </Box>
          </Stack>

          {/* Filter Actions */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={loading || !hasActiveFilters()}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<Search />}
            >
              Apply Filters
            </Button>
          </Stack>
        </Box>
      </Collapse>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {searchParams.destination && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'primary.50',
                  color: 'primary.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                {searchParams.destination}
              </Box>
            )}
            
            {(searchParams.minPrice !== undefined && searchParams.minPrice > 0) && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'success.50',
                  color: 'success.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                Min: ${searchParams.minPrice}
              </Box>
            )}
            
            {(searchParams.maxPrice !== undefined && searchParams.maxPrice > 0) && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'success.50',
                  color: 'success.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                Max: ${searchParams.maxPrice}
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

// Optional: Also add a default export if you want to support both import styles
export default SearchPackages;