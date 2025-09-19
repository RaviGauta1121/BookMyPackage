// ==================== src/pages/Bookings.tsx ====================
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { BookingService } from '../services/bookingService';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { BookingCard } from '../components/bookings/BookingCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Booking } from '../types/booking';

export const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: bookings, loading, error, refetch } = useApi<Booking[]>(
    () => BookingService.getMyBookings(),
    []
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const bookingStats = bookings?.reduce(
    (stats, booking) => {
      stats[booking.status] = (stats[booking.status] || 0) + 1;
      return stats;
    },
    {} as Record<string, number>
  ) || {};

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track your travel bookings
        </Typography>
      </Box>

      {/* Booking Statistics */}
      {Object.keys(bookingStats).length > 0 && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(bookingStats).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              variant="outlined"
              color={
                status === 'Confirmed' ? 'success' :
                status === 'Pending' ? 'warning' :
                status === 'Cancelled' ? 'error' : 'default'
              }
            />
          ))}
        </Box>
      )}

      {/* Search and Filter */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by package name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {(searchTerm || statusFilter) && (
          <Button
            startIcon={<Clear />}
            onClick={handleClearFilters}
            variant="outlined"
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {bookings?.length === 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                No bookings yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start exploring our travel packages to make your first booking!
              </Typography>
              <Button variant="contained" href="/packages">
                Browse Packages
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                No bookings match your filters
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            }, 
            gap: 3 
          }}
        >
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onBookingChange={refetch}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};