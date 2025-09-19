import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import { BookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const statusColors: { [key: string]: 'warning' | 'success' | 'error' | 'info' } = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info',
    active: 'success',
    inactive: 'error'
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      await BookingService.updateBookingStatus(selectedBooking.id, newStatus);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: newStatus as any }
          : booking
      ));
      
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus('');
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const openStatusDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No bookings found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3} sx={{ mt: 3 }}>
          {bookings.map((booking) => (
            <Card 
              key={booking.id} 
              elevation={2}
              sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': { 
                  elevation: 4,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    Booking #{booking.id}
                  </Typography>
                  <Chip 
                    label={booking.status.toUpperCase()} 
                    color={statusColors[booking.status] || 'default'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Typography variant="h5" gutterBottom color="primary" fontWeight="600">
                  {(booking as any).packageName || (booking as any).package?.name || 'Travel Package'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  mb: 2
                }}>
                  <Box flex="1" minWidth="250px">
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Customer Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {(booking as any).userName || 'N/A'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Email:</strong> {(booking as any).userEmail || 'N/A'}
                    </Typography>
                  </Box>

                  <Box flex="1" minWidth="200px">
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Travel Details
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>From:</strong> {formatDate((booking as any).travelDate || booking.createdAt)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>To:</strong> {formatDate((booking as any).returnDate || booking.createdAt)}
                    </Typography>
                  </Box>

                  <Box flex="1" minWidth="150px">
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Booking Info
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Booked:</strong> {formatDate(booking.createdAt)}
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {formatCurrency((booking as any).totalPrice || (booking as any).price || 0)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="flex-end">
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => openStatusDialog(booking)}
                    sx={{ minWidth: 150 }}
                  >
                    Update Status
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Booking #{selectedBooking.id} - {(selectedBooking as any).packageName || 'Travel Package'}
              </Typography>
              <TextField
                select
                fullWidth
                label="Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={updating || newStatus === selectedBooking?.status}
          >
            {updating ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;