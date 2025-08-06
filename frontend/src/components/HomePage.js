import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  WbSunny,
  Cloud,
  BeachAccess,
  FilterDrama,
  AcUnit,
  Whatshot,
  NewReleases
} from '@mui/icons-material';

// Styled components
const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
  }
}));

const ClimateCard = styled(SectionCard)({
  height: '100%',
  minHeight: '300px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white'
});

const HomePage = () => {
  // Sample data
  const recommendations = [
    { id: 1, title: 'Morning Walk', icon: <WbSunny />, time: '6:00 AM' },
    { id: 2, title: 'Work Session', icon: <Whatshot />, time: '9:00 AM' },
    { id: 3, title: 'Afternoon Break', icon: <Cloud />, time: '1:00 PM' }
  ];

  const moodOptions = [
    { id: 1, label: 'Happy', emoji: '😊' },
    { id: 2, label: 'Energetic', emoji: '⚡' },
    { id: 3, label: 'Relaxed', emoji: '🧘' },
    { id: 4, label: 'Creative', emoji: '🎨' }
  ];

  const climateData = {
    temp: '24°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    wind: '12 km/h',
    icon: <FilterDrama sx={{ fontSize: 60 }} />
  };

  const newsItems = [
    { id: 1, title: 'New mindfulness study shows benefits', source: 'Health News' },
    { id: 2, title: 'How weather affects your mood', source: 'Psychology Today' },
    { id: 3, title: 'Best places for mental wellness', source: 'Travel Guide' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #4e46bcff 30%, #9077e1ff 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Mindcue
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Auto Recommend Box */}
        <Grid item xs={12} md={4}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <NewReleases color="primary" />
                Daily Recommendations
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recommendations.map(item => (
                  <Box key={item.id} sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: '8px',
                    bgcolor: 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </SectionCard>
        </Grid>

        {/* Mood Check Box */}
        <Grid item xs={12} md={4}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How are you feeling today?
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center'
              }}>
                {moodOptions.map(mood => (
                  <Chip
                    key={mood.id}
                    label={`${mood.emoji} ${mood.label}`}
                    sx={{
                      fontSize: '1rem',
                      p: 1.5,
                      borderRadius: '12px',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                    clickable
                  />
                ))}
              </Box>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Select your mood for personalized suggestions
                </Typography>
              </Box>
            </CardContent>
          </SectionCard>
        </Grid>

        {/* Climate Box - Takes full width on mobile, double width on desktop */}
        <Grid item xs={12} md={8}>
          <ClimateCard>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Today's Climate
              </Typography>
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 2,
                mt: 2
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  {climateData.icon}
                  <Typography variant="h3">{climateData.temp}</Typography>
                  <Typography variant="subtitle1">{climateData.condition}</Typography>
                </Box>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2
                }}>
                  <ClimateDetailItem icon={<AcUnit />} label="Humidity" value={climateData.humidity} />
                  <ClimateDetailItem icon={<BeachAccess />} label="Wind" value={climateData.wind} />
                </Box>
              </Box>
            </CardContent>
          </ClimateCard>
        </Grid>

        {/* News Box - Takes full width */}
        <Grid item xs={12}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Checkout News
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {newsItems.map(news => (
                  <Grid item xs={12} sm={4} key={news.id}>
                    <Card variant="outlined" sx={{ 
                      p: 2,
                      height: '100%',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {news.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {news.source}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </SectionCard>
        </Grid>
      </Grid>
    </Container>
  );
};

// Helper component for climate details
const ClimateDetailItem = ({ icon, label, value }) => (
  <Box sx={{ 
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: 'rgba(255,255,255,0.1)',
    p: 1.5,
    borderRadius: '8px'
  }}>
    <Avatar sx={{ bgcolor: 'transparent', color: 'white', width: 32, height: 32 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>{label}</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
  </Box>
);

export default HomePage;