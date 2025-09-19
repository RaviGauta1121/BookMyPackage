// ==================== src/components/packages/PackageCard.tsx ====================
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  People,
  CalendarToday,
  AttachMoney,
  Visibility,
  TravelExplore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TravelPackage } from './PackageList';

export interface PackageCardProps {
  package: TravelPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return dateStr;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleViewDetails = () => {
    navigate(`/packages/${pkg.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      {/* Header with Image/Gradient */}
      <Box
        sx={{
          height: 200,
          background: pkg.imageUrl 
            ? `url(${pkg.imageUrl})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!pkg.imageUrl && (
          <TravelExplore sx={{ fontSize: 60, color: 'white', opacity: 0.7 }} />
        )}
        
        {/* Status Chip */}
        <Chip
          label={pkg.isActive ? 'Active' : 'Inactive'}
          color={pkg.isActive ? 'success' : 'error'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title and Location */}
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {pkg.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 18, color: 'primary.main', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {pkg.destination}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            minHeight: '2.4em',
            mb: 3,
          }}
        >
          {pkg.description}
        </Typography>

        {/* Package Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', mr: 1 }}>
                <Schedule sx={{ fontSize: 14 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {pkg.duration} days
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main', mr: 1 }}>
                <People sx={{ fontSize: 14 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Max Capacity
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {pkg.maxCapacity} people
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'warning.main', mr: 1 }}>
                <CalendarToday sx={{ fontSize: 14 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Dates
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              fontWeight={500}
              sx={{ fontSize: '0.75rem' }}
            >
              {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ fontSize: 20, color: 'success.main', mr: 0.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
            {formatPrice(pkg.price)}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<Visibility />}
          onClick={handleViewDetails}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PackageCard;