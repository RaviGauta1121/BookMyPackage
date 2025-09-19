// ==================== src/components/bookings/BookingCard.tsx ====================
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Event,
  People,
  AttachMoney,
  Cancel,
} from '@mui/icons-material';
import { Booking } from '../../types/booking';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import { BookingService } from '../../services/bookingService';
import { toast } from 'react-toastify';

interface BookingCardProps {
  booking: Booking;
  onBookingChange: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onBookingChange,
}) => {
  const [cancelDialog, setCancelDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';

  const handleCancel = async () => {
    setLoading(true);
    try {
      await BookingService.cancelBooking(booking.id);
      toast.success('Booking cancelled successfully!');
      onBookingChange();
    } catch (error: any) {
      toast.error('Failed to cancel booking');
    } finally {
      setLoading(false);
      setCancelDialog(false);
    }
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div">
              {booking.packageTitle}
            </Typography>
            <Chip 
              label={booking.status} 
              color={getStatusColor(booking.status)} 
              size="small" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Event sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Booked on {formatDate(booking.bookingDate)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? 'traveler' : 'travelers'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Total: {formatCurrency(booking.totalPrice)}
            </Typography>
          </Box>
          
          {booking.specialRequests && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Special Requests:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {booking.specialRequests}
              </Typography>
            </Box>
          )}
          
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => setCancelDialog(true)}
              disabled={loading}
              fullWidth
            >
              Cancel Booking
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>
            Keep Booking
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};