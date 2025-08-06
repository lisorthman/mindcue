import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getCurrentLocation } from '../services/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExploreIcon from '@mui/icons-material/Explore';
import PinDropIcon from '@mui/icons-material/PinDrop';

// Modern card styling with glass morphism effect
const CenteredCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  maxWidth: 450,
  width: '100%',
}));

// Modal style
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const paperStyle = {
  backgroundColor: 'white',
  boxShadow: 24,
  padding: '32px',
  borderRadius: '16px',
  outline: 'none',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center'
};

const LandingPage = () => {
  const [locationInput, setLocationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    setModalContent(`📍 Location set to: ${locationInput}`);
    setOpenModal(true);
  };

  const handleUseMyLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getCurrentLocation();
      setModalContent(`🌍 Location found! Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}`);
      setOpenModal(true);
    } catch (error) {
      setModalContent(`❌ Error: ${error.message}`);
      setOpenModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: 'primary.main',
          textAlign: 'center',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <ExploreIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
        Mindcue
      </Typography>

      <CenteredCard>
        <CardContent sx={{ width: '100%' }}>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <LocationOnIcon color="primary" />
            Access Location
          </Typography>

          <Box
            component="form"
            onSubmit={handleLocationSubmit}
            sx={{ width: '100%' }}
          >
            <TextField
              fullWidth
              label="Enter Location"
              variant="outlined"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <PinDropIcon color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ 
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              disabled={!locationInput.trim()}
            >
              📍 Enter Location
            </Button>
          </Box>

          <Typography
            variant="body1"
            align="center"
            sx={{ 
              my: 2,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:before, &:after': {
                content: '""',
                flex: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                mx: 2
              }
            }}
          >
            OR
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleUseMyLocation}
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 'bold',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1
              }
            }}
            startIcon={isLoading ? null : <LocationOnIcon />}
          >
            {isLoading ? '🛰️ Detecting Location...' : '🌍 Use My Location'}
          </Button>
        </CardContent>
      </CenteredCard>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={modalStyle}
      >
        <Fade in={openModal}>
          <Box sx={paperStyle}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              {modalContent.startsWith('❌') ? 'Error' : 'Success'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {modalContent}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleCloseModal}
              sx={{
                borderRadius: '12px',
                px: 4,
                fontWeight: 'bold'
              }}
            >
              Got it!
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default LandingPage;