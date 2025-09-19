import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  LocationOn,
  Schedule,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PackageService } from '../../services/packageService';
import { CreatePackageRequest } from '../../types/package';
import { ROUTES } from '../../utils/constants';
import { toast } from 'react-toastify';

export const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreatePackageRequest>({
    title: '',
    description: '',
    destination: '',
    price: 0,
    duration: 1,
    startDate: '',
    endDate: '',
    maxCapacity: 1,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePackageRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePackageRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }

      if (startDate <= new Date()) {
        newErrors.startDate = 'Start date must be in the future';
      }
    }

    if (formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Max capacity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreatePackageRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'duration' || field === 'maxCapacity' 
        ? (value === '' ? 0 : Number(value)) 
        : value
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await PackageService.createPackage(formData);
      toast.success('Package created successfully!');
      navigate(ROUTES.PACKAGES);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.PACKAGES)}
        sx={{ mb: 3 }}
      >
        Back to Packages
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Create New Travel Package
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: 3 
            }}
          >
            {/* Title */}
            <TextField
              fullWidth
              label="Package Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
              placeholder="Enter an attractive package title"
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              required
              placeholder="Describe the package features, activities, and highlights"
            />

            {/* Destination and Duration */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: '1fr 1fr' 
                }, 
                gap: 3 
              }}
            >
              <TextField
                fullWidth
                label="Destination"
                value={formData.destination}
                onChange={handleInputChange('destination')}
                error={!!errors.destination}
                helperText={errors.destination}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., Paris, France"
              />

              <TextField
                fullWidth
                type="number"
                label="Duration (days)"
                value={formData.duration || ''}
                onChange={handleInputChange('duration')}
                error={!!errors.duration}
                helperText={errors.duration}
                required
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Price and Max Capacity */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: '1fr 1fr' 
                }, 
                gap: 3 
              }}
            >
              <FormControl fullWidth error={!!errors.price} required>
                <InputLabel htmlFor="price-input">Price</InputLabel>
                <OutlinedInput
                  id="price-input"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange('price')}
                  startAdornment={<InputAdornment position="start"><AttachMoney color="primary" /></InputAdornment>}
                  label="Price"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                {errors.price && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.price}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Max Capacity"
                value={formData.maxCapacity || ''}
                onChange={handleInputChange('maxCapacity')}
                error={!!errors.maxCapacity}
                helperText={errors.maxCapacity}
                required
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Start and End Dates */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: '1fr 1fr' 
                }, 
                gap: 3 
              }}
            >
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={handleInputChange('startDate')}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayDate() }}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={handleInputChange('endDate')}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || getTodayDate() }}
              />
            </Box>

            {/* Image URL */}
            <TextField
              fullWidth
              type="url"
              label="Image URL (Optional)"
              value={formData.imageUrl}
              onChange={handleInputChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
              helperText="Provide a URL to an image that represents your package"
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.PACKAGES)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Package'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};