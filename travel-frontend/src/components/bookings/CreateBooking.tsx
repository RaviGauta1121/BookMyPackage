// ==================== src/components/bookings/CreateBooking.tsx ====================
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { TravelPackage } from '../../types/package';
import { CreateBookingRequest } from '../../types/booking';
import { formatCurrency } from '../../utils/helpers';

interface CreateBookingProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (booking: CreateBookingRequest) => void;
  package: TravelPackage | null;
  loading: boolean;
}

export const CreateBooking: React.FC<CreateBookingProps> = ({
  open,
  onClose,
  onSubmit,
  package: pkg,
  loading,
}) => {
  const [bookingData, setBookingData] = useState<CreateBookingRequest>({
    travelPackageId: pkg?.id || 0,
    numberOfTravelers: 1,
    specialRequests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...bookingData, travelPackageId: pkg?.id || 0 });
  };

  const totalCost = (pkg?.price || 0) * bookingData.numberOfTravelers;

  if (!pkg) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Your Trip</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pkg.title} - {formatCurrency(pkg.price)} per person
            </Typography>
            
            <TextField
              fullWidth
              label="Number of Travelers"
              type="number"
              value={bookingData.numberOfTravelers}
              onChange={(e) => setBookingData({
                ...bookingData,
                numberOfTravelers: parseInt(e.target.value) || 1
              })}
              inputProps={{ min: 1, max: Math.min(10, pkg.availableSlots) }}
              sx={{ mb: 2, mt: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Special Requests"
              multiline
              rows={3}
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({
                ...bookingData,
                specialRequests: e.target.value
              })}
              placeholder="Any dietary requirements, accessibility needs, or other requests..."
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h6" color="primary">
              Total Cost: {formatCurrency(totalCost)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};