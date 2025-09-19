// ==================== src/pages/PackageDetails.tsx ====================
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  People,
  CalendarToday,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { PackageService } from '../services/packageService';
import { BookingService } from '../services/bookingService';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { CreateBookingRequest } from '../types/booking';
import { toast } from 'react-toastify';

export const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState<CreateBookingRequest>({
    travelPackageId: parseInt(id || '0'),
    numberOfTravelers: 1,
    specialRequests: '',
  });

  const { data: pkg, loading, error } = useApi(
    () => PackageService.getPackageById(parseInt(id || '0')),
    [id]
  );

  const handleBooking = async () => {
    try {
      await BookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      setBookingDialog(false);
      navigate(ROUTES.BOOKINGS);
    } catch (error: any) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading package details..." />;
  }

  if (error || !pkg) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Package not found
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button onClick={() => navigate(ROUTES.PACKAGES)}>
            Back to Packages
          </Button>
        </Box>
      </Container>
    );
  }

  const isAvailable = pkg.availableSlots > 0 && new Date(pkg.startDate) > new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.PACKAGES)}
        sx={{ mb: 3 }}
      >
        Back to Packages
      </Button>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: '2fr 1fr' 
          }, 
          gap: 4 
        }}
      >
        <Box>
          <Paper sx={{ overflow: 'hidden' }}>
            {pkg.imageUrl && (
              <Box
                component="img"
                src={pkg.imageUrl}
                alt={pkg.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                }}
              />
            )}
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                {pkg.title}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: '1fr 1fr' 
                  }, 
                  gap: 2, 
                  mb: 3 
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Destination:</strong> {pkg.destination}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Duration:</strong> {pkg.duration} {pkg.duration === 1 ? 'day' : 'days'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Start Date:</strong> {formatDate(pkg.startDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>End Date:</strong> {formatDate(pkg.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {pkg.description}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Booking Card */}
        <Box>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatCurrency(pkg.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per person
              </Typography>

              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {pkg.availableSlots} slots available
                  </Typography>
                </Box>
                <Chip
                  label={isAvailable ? 'Available' : 'Not Available'}
                  color={isAvailable ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              {user ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!isAvailable}
                  onClick={() => setBookingDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Book Now
                </Button>
              ) : (
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    sx={{ mb: 1 }}
                  >
                    Login to Book
                  </Button>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Please login to make a booking
                  </Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(ROUTES.PACKAGES)}
              >
                View All Packages
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Your Trip</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
            <strong>{pkg.title}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatCurrency(pkg.price)} per person
          </Typography>

          <TextField
            fullWidth
            label="Number of Travelers"
            type="number"
            value={bookingData.numberOfTravelers}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                numberOfTravelers: parseInt(e.target.value) || 1,
              })
            }
            inputProps={{ min: 1, max: pkg.availableSlots }}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Special Requests (Optional)"
            multiline
            rows={3}
            value={bookingData.specialRequests}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                specialRequests: e.target.value,
              })
            }
            margin="normal"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6">
              Total: {formatCurrency(pkg.price * bookingData.numberOfTravelers)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};