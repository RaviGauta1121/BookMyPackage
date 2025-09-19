// ==================== src/components/common/Footer.tsx ====================
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Card
} from '@mui/material';
import { Flight, Phone, Email } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 4 
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Flight sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary">
                Travel Management
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Your trusted partner for amazing travel experiences around the world.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                About Us
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Contact
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Terms of Service
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Privacy Policy
              </Link>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  info@travelmanagement.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 Travel Management System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};