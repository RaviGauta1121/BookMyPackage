// ==================== src/pages/Dashboard.tsx ====================
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  People,
  FlightTakeoff,
  BookmarkBorder,
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PackageService } from '../services/packageService';
import { BookingService } from '../services/bookingService';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { TravelPackage } from '../types/package';
import { Booking } from '../types/booking';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalPackages: number;
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; packageId: number | null }>({
    open: false,
    packageId: null,
  });
  const [bookingStatusDialog, setBookingStatusDialog] = useState<{ 
    open: boolean; 
    bookingId: number | null; 
    currentStatus: string 
  }>({
    open: false,
    bookingId: null,
    currentStatus: '',
  });
  const [newStatus, setNewStatus] = useState('');

  // API calls
  const { data: packages, loading: packagesLoading, error: packagesError, refetch: refetchPackages } = useApi<TravelPackage[]>(
    () => PackageService.getAllPackages(),
    []
  );

  const { data: bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useApi<Booking[]>(
    () => BookingService.getAllBookings(),
    []
  );

  // Calculate dashboard stats
  const stats: DashboardStats = React.useMemo(() => {
    if (!packages || !bookings) {
      return { totalPackages: 0, totalBookings: 0, totalRevenue: 0, activePackages: 0 };
    }

    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const activePackages = packages.filter(p => p.availableSlots > 0 && new Date(p.startDate) > new Date()).length;

    return {
      totalPackages: packages.length,
      totalBookings: bookings.length,
      totalRevenue,
      activePackages,
    };
  }, [packages, bookings]);

  const handleDeletePackage = async () => {
    if (!deleteDialog.packageId) return;
    
    try {
      await PackageService.deletePackage(deleteDialog.packageId);
      toast.success('Package deleted successfully!');
      refetchPackages();
    } catch (error: any) {
      toast.error('Failed to delete package');
    } finally {
      setDeleteDialog({ open: false, packageId: null });
    }
  };

  const handleUpdateBookingStatus = async () => {
    if (!bookingStatusDialog.bookingId || !newStatus) return;
    
    try {
      await BookingService.updateBookingStatus(bookingStatusDialog.bookingId, newStatus);
      toast.success('Booking status updated successfully!');
      refetchBookings();
    } catch (error: any) {
      toast.error('Failed to update booking status');
    } finally {
      setBookingStatusDialog({ open: false, bookingId: null, currentStatus: '' });
      setNewStatus('');
    }
  };

  const loading = packagesLoading || bookingsLoading;
  const error = packagesError || bookingsError;

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage travel packages and bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          }, 
          gap: 3, 
          mb: 4 
        }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Packages
                </Typography>
                <Typography variant="h4">{stats.totalPackages}</Typography>
              </Box>
              <FlightTakeoff sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Active Packages
                </Typography>
                <Typography variant="h4">{stats.activePackages}</Typography>
              </Box>
              <BookmarkBorder sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Bookings
                </Typography>
                <Typography variant="h4">{stats.totalBookings}</Typography>
              </Box>
              <People sx={{ fontSize: 40, color: 'info.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Revenue
                </Typography>
                <Typography variant="h4">{formatCurrency(stats.totalRevenue)}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Packages" />
          <Tab label="Bookings" />
        </Tabs>

        {/* Packages Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Travel Packages</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate(ROUTES.CREATE_PACKAGE)}
            >
              Create Package
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Available Slots</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages?.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.title}</TableCell>
                    <TableCell>{pkg.destination}</TableCell>
                    <TableCell>{formatCurrency(pkg.price)}</TableCell>
                    <TableCell>{pkg.duration} days</TableCell>
                    <TableCell>{pkg.availableSlots}</TableCell>
                    <TableCell>{formatDate(pkg.startDate)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/packages/${pkg.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => navigate(`${ROUTES.CREATE_PACKAGE}?edit=${pkg.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => setDeleteDialog({ open: true, packageId: pkg.id })}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Bookings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>All Bookings</Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Travelers</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.packageTitle}</TableCell>
                    <TableCell>{booking.userName || 'N/A'}</TableCell>
                    <TableCell>{booking.numberOfTravelers}</TableCell>
                    <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                    <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={getStatusColor(booking.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setBookingStatusDialog({
                            open: true,
                            bookingId: booking.id,
                            currentStatus: booking.status,
                          });
                          setNewStatus(booking.status);
                        }}
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Delete Package Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, packageId: null })}>
        <DialogTitle>Delete Package</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this package? This action cannot be undone and will affect existing bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, packageId: null })}>Cancel</Button>
          <Button onClick={handleDeletePackage} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Booking Status Dialog */}
      <Dialog open={bookingStatusDialog.open} onClose={() => setBookingStatusDialog({ open: false, bookingId: null, currentStatus: '' })}>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingStatusDialog({ open: false, bookingId: null, currentStatus: '' })}>
            Cancel
          </Button>
          <Button onClick={handleUpdateBookingStatus} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};