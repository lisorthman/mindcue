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
  Chip,
  Button,
  useTheme,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  WbSunny,
  Thunderstorm,
  BeachAccess,
  FilterDrama,
  AcUnit,
  Whatshot,
  NewReleases,
  ChevronRight,
  Mood,
  Recommend,
  Favorite,
  SelfImprovement,
  Coffee,
  FitnessCenter
} from '@mui/icons-material';

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const ModernCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 40, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  }
}));

const ClimateCard = styled(ModernCard)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #3a416f 0%, #141727 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    top: '-50px',
    right: '-50px'
  }
}));

const MoodChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2]
  }
}));

const HomePage = () => {
  const theme = useTheme();
  
  // Mood Options
  const moodOptions = [
    { id: 1, label: 'Energized', emoji: '⚡', icon: <Whatshot /> },
    { id: 2, label: 'Calm', emoji: '🧘', icon: <Mood /> },
    { id: 3, label: 'Creative', emoji: '🎨', icon: <Favorite /> },
    { id: 4, label: 'Tired', emoji: '😴', icon: <Coffee /> }
  ];

  // Recommendations Data
  const recommendations = [
    {
      id: 1,
      title: 'Morning Meditation',
      time: '6:30 AM',
      icon: <SelfImprovement />,
      completed: true
    },
    {
      id: 2,
      title: 'Hydration Break',
      time: '10:00 AM',
      icon: <FitnessCenter />,
      completed: false
    },
    {
      id: 3,
      title: 'Afternoon Walk',
      time: '3:30 PM',
      icon: <FitnessCenter />,
      completed: false
    }
  ];

  // Climate Data
  const climateData = {
    temp: '24°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    wind: '12 km/h',
    precipitation: '10%',
    icon: <FilterDrama sx={{ 
      fontSize: 80,
      animation: `${floatAnimation} 4s ease-in-out infinite`,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
    }} />
  };

  // News Data
  const newsItems = [
    { 
      id: 1, 
      title: 'New study shows mindfulness boosts productivity', 
      source: 'Neuroscience News',
      time: '2h ago'
    },
    { 
      id: 2, 
      title: 'Seasonal changes affect mental health', 
      source: 'Psychology Today',
      time: '5h ago'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at top, #1a1a2e 0%, #16213e 100%)'
        : 'radial-gradient(circle at top, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        position: 'relative'
      }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(45deg, #3f34beff 20%, #9599e7ff 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          letterSpacing: '-0.5px'
        }}>
          Mindcue
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          mt: 2,
          color: 'text.secondary',
          fontWeight: 500
        }}>
          Your personalized wellness dashboard
        </Typography>
      </Box>

      {/* First Row - Mood and Recommendations */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Mood Check Box */}
        <Grid item xs={12} md={6}>
          <ModernCard>
            <CardContent>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3
              }}>
                <Avatar sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText'
                }}>
                  <Mood />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Current Mood
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Select how you're feeling today:
              </Typography>

              <Grid container spacing={2}>
                {moodOptions.map(mood => (
                  <Grid item xs={6} key={mood.id}>
                    <MoodChip
                      icon={
                        <Avatar sx={{ 
                          bgcolor: 'background.default',
                          width: 24,
                          height: 24,
                          mr: -1,
                          ml: -0.5
                        }}>
                          {mood.icon}
                        </Avatar>
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 1 }}>
                            {mood.emoji}
                          </Typography>
                          {mood.label}
                        </Box>
                      }
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        bgcolor: 'background.paper'
                      }}
                      clickable
                    />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ 
                mt: 4,
                p: 2,
                borderRadius: '12px',
                background: theme.palette.action.hover,
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  "Your mood suggests you might enjoy a short meditation"
                </Typography>
                <Button 
                  variant="text" 
                  size="small"
                  endIcon={<ChevronRight />}
                  sx={{ 
                    textTransform: 'none',
                    animation: `${pulseAnimation} 2s infinite`
                  }}
                >
                  Try recommendation
                </Button>
              </Box>
            </CardContent>
          </ModernCard>
        </Grid>

        {/* Auto Recommend Box */}
        <Grid item xs={12} md={6}>
          <ModernCard>
            <CardContent>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3
              }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <Recommend />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Your Recommendations
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {recommendations.map(item => (
                  <Box 
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: '12px',
                      background: theme.palette.action.hover,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        background: theme.palette.action.selected
                      }
                    }}
                  >
                    <Badge
                      color="success"
                      overlap="circular"
                      badgeContent=" "
                      invisible={!item.completed}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Avatar sx={{ 
                        bgcolor: item.completed 
                          ? 'success.light' 
                          : 'background.paper',
                        color: item.completed 
                          ? 'success.contrastText' 
                          : 'text.secondary',
                        mr: 2
                      }}>
                        {item.icon}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                    <Button 
                      size="small" 
                      variant={item.completed ? "text" : "contained"}
                      sx={{
                        borderRadius: '12px',
                        minWidth: '100px',
                        textTransform: 'none'
                      }}
                    >
                      {item.completed ? 'Done' : 'Start'}
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Second Row - Climate and News */}
      <Grid container spacing={3}>
        {/* Climate Box */}
        <Grid item xs={12} md={6}>
          <ClimateCard>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Today's Climate
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                mt: 3
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  {climateData.icon}
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    lineHeight: 1,
                    mt: 1
                  }}>
                    {climateData.temp}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600,
                    opacity: 0.9
                  }}>
                    {climateData.condition}
                  </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ flex: 1 }}>
                  <ClimateDetailItem 
                    icon={<AcUnit sx={{ color: 'white' }} />} 
                    label="Humidity" 
                    value={climateData.humidity} 
                  />
                  <ClimateDetailItem 
                    icon={<BeachAccess sx={{ color: 'white' }} />} 
                    label="Wind" 
                    value={climateData.wind} 
                  />
                  <ClimateDetailItem 
                    icon={<Thunderstorm sx={{ color: 'white' }} />} 
                    label="Precip" 
                    value={climateData.precipitation} 
                  />
                </Grid>
              </Box>
            </CardContent>
          </ClimateCard>
        </Grid>

        {/* News Box */}
        <Grid item xs={12} md={6}>
          <ModernCard>
            <CardContent>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Wellness News
                </Typography>
                <Button 
                  endIcon={<ChevronRight />}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {newsItems.map(news => (
                  <Card key={news.id} variant="outlined" sx={{ 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[4],
                      borderColor: 'primary.main'
                    }
                  }}>
                    <CardContent sx={{ py: '12px !important' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          transition: 'color 0.3s',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        {news.title}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          {news.source}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {news.time}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </ModernCard>
        </Grid>
      </Grid>
    </Container>
  );
};

// Climate Detail Component
const ClimateDetailItem = ({ icon, label, value }) => (
  <Grid item xs={6}>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.1)'
    }}>
      <Avatar sx={{ 
        bgcolor: 'rgba(255,255,255,0.2)',
        width: 40, 
        height: 40 
      }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

export default HomePage;