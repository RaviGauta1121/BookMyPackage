import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Schedule,
  People,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { PackageService } from '../../services/packageService';
import { BookingService } from '../../services/bookingService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { CreateBookingRequest } from '../../types/booking';
import { toast } from 'react-toastify';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { data: pkg, loading, error } = useApi(
    () => PackageService.getPackageById(parseInt(id || '0')),
    [id]
  );

  const handleBooking = async () => {
    if (!pkg || !user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const bookingData: CreateBookingRequest = {
        travelPackageId: pkg.id,
        numberOfTravelers: numberOfPeople,
        specialRequests: specialRequests || '',
      };

      await BookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate(ROUTES.BOOKINGS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Booking failed';
      setBookingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading package details..." />;
  }

  if (error || !pkg) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center" gutterBottom>
          {error || 'Package not found'}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button onClick={() => navigate(ROUTES.PACKAGES)}>
            Back to Packages
          </Button>
        </Box>
      </Container>
    );
  }

  const totalPrice = pkg.price * numberOfPeople;
  const isAvailable = pkg.availableSlots > 0 && new Date(pkg.startDate) > new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.PACKAGES)}
        sx={{ mb: 3 }}
      >
        Back to Packages
      </Button>

      <Paper sx={{ overflow: 'hidden', mb: 4 }}>
        {/* Header Image */}
        <Box sx={{ position: 'relative', height: { xs: 250, md: 400 } }}>
          {pkg.imageUrl ? (
            <Box
              component="img"
              src={pkg.imageUrl}
              alt={pkg.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationOn sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
            </Box>
          )}
          
          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          
          {/* Title Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: 'white',
              zIndex: 1,
            }}
          >
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {pkg.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="h6">{pkg.destination}</Typography>
            </Box>
          </Box>
          
          {/* Status Badge */}
          {isAvailable && (
            <Chip
              label="Available"
              color="success"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                lg: '2fr 1fr' 
              }, 
              gap: 4 
            }}
          >
            {/* Left Column - Details */}
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                About This Package
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                {pkg.description}
              </Typography>

              {/* Package Information Grid */}
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)' 
                  }, 
                  gap: 3,
                  mt: 4
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Duration
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {pkg.duration} {pkg.duration === 1 ? 'day' : 'days'}
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <People sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Available Slots
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {pkg.availableSlots} slots
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Start Date
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(pkg.startDate)}
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        End Date
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(pkg.endDate)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Right Column - Booking */}
            <Box>
              <Card sx={{ position: 'sticky', top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <AttachMoney sx={{ color: 'success.main' }} />
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {formatCurrency(pkg.price)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      per person
                    </Typography>
                  </Box>

                  {bookingError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {bookingError}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Number of People</InputLabel>
                      <Select
                        value={numberOfPeople}
                        label="Number of People"
                        onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                      >
                        {Array.from({ length: Math.min(pkg.availableSlots, 10) }, (_, i) => i + 1).map(num => (
                          <MenuItem key={num} value={num}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Special Requests (Optional)"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements or requests..."
                    />

                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Total Price:</Typography>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {formatCurrency(totalPrice)}
                        </Typography>
                      </Box>

                      {user ? (
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={handleBooking}
                          disabled={isBooking || !isAvailable}
                        >
                          {isBooking ? 'Processing...' : 'Book Now'}
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={() => navigate(ROUTES.LOGIN)}
                        >
                          Login to Book
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PackageDetails;