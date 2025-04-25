import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import aboutUS from "../assets/aboutUS.jpeg"
import heroImage from "../assets/heroImage.jpeg"
import contactUS from "../assets/contactUs.png" // You'll need to add this image to your assets folder

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0', // Blue
    },
    secondary: {
      main: '#FF9800', // Orange
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '2rem',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
  },
});

function LandingPage() {
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');
  const [gradYear, setGradYear] = useState('');
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box 
          sx={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, mt: 8 }}>
            <Typography variant="h1" gutterBottom>
              Find Your Perfect Roommate
            </Typography>
          </Container>
        </Box>

        {/* Find Roommate Card - Moved between hero image and How It Works */}
        <Container maxWidth="md" sx={{ mt: -4, mb: 6, position: 'relative', zIndex: 3 }}>
          <Box 
            sx={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: '1rem',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel id="major-label">Major</InputLabel>
              <Select
                labelId="major-label"
                id="major-select"
                value={major}
                label="Major"
                onChange={(e) => setMajor(e.target.value)}
              >
                <MenuItem value=""><em>Any</em></MenuItem>
                <MenuItem value="CS">Computer Science</MenuItem>
                <MenuItem value="ENG">Engineering</MenuItem>
                <MenuItem value="BUS">Business</MenuItem>
                <MenuItem value="ART">Arts</MenuItem>
                <MenuItem value="SCI">Sciences</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value=""><em>Any</em></MenuItem>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="NB">Non-Binary</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel id="grad-year-label">Graduation Year</InputLabel>
              <Select
                labelId="grad-year-label"
                id="grad-year-select"
                value={gradYear}
                label="Graduation Year"
                onChange={(e) => setGradYear(e.target.value)}
              >
                <MenuItem value=""><em>Any</em></MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
                <MenuItem value="2027">2027</MenuItem>
                <MenuItem value="2028">2028</MenuItem>
                <MenuItem value="2029">2029</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ 
                minWidth: isMobile ? '100%' : '150px',
                height: '56px'
              }}
            >
              Find Roommate
            </Button>
          </Box>
        </Container>

        {/* How It Works Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', padding: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <CreateIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h3">
                    Create Your Profile
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tell us about your lifestyle, habits, and what you're looking for in a roommate.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', padding: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <SearchIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h3">
                    Find Your Match
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our algorithm suggests compatible roommates based on your preferences and lifestyle.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', padding: 4 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                      <PersonIcon sx={{ fontSize: 80, position: 'absolute', left: 0, color: theme.palette.primary.main }} />
                      <Box sx={{ position: 'absolute', right: -10, top: 5 }}>
                        <CheckCircleIcon sx={{ color: 'green', fontSize: 30 }} />
                      </Box>
                      <Box sx={{ position: 'absolute', right: -10, bottom: 5 }}>
                        <CancelIcon sx={{ color: 'red', fontSize: 30 }} />
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="h3">
                    Select Your Roommate
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Connect, chat, and choose the perfect roommate who shares your values and living style.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* About Us Section */}
        <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2">
                  About Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  At ROOMIE, we're dedicated to making student life smoother by helping you find the perfect roommate. Built with care for university students, our app uses smart matching based on lifestyle preferences, habits, and interests—so you can live with someone who truly vibes with you.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  Whether you're a freshman or a transfer student, ROOMIE takes the stress out of housing and makes your campus feel more like home.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src={aboutUS}
                  alt="Students in dorm"
                  sx={{ 
                    width: '100%',
                    boxShadow: 'none' 
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Contact Us Section - Styled like About Us with image on left */}
        <Box sx={{ backgroundColor: 'white', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" align="center" gutterBottom>
              Contact Us
            </Typography>
            
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src={contactUS}
                  alt="Contact us"
                  sx={{ 
                    width: '100%',
                    boxShadow: 'none' 
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h3" gutterBottom>
                  Get In Touch
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  Have questions or feedback? We'd love to hear from you! Our team is here to help with any inquiries about our roommate matching service.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    support@roomie.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    (800) 123-4567
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    123 Campus Drive, College Town, ST 12345
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer - using same blue color as theme */}
        <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 3, mt: 4 }}>
          <Container maxWidth="lg">
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="body1">
                  ROOMIE © 2025
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  <Box component="span" sx={{ cursor: 'pointer', mr: 2 }}>
                    Privacy Policy
                  </Box>
                  <Box component="span" sx={{ cursor: 'pointer' }}>
                    Terms of Service
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LandingPage;