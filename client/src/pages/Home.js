import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, DirectionsCar, Speed, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await axios.get('/api/vehicles', {
          params: { limit: 6 }
        });
        setFeaturedVehicles(response.data);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/vehicles?search=${searchQuery}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Find Your Perfect Vehicle
          </Typography>
          <Typography variant="h5" gutterBottom>
            Browse through thousands of vehicles from trusted dealers and private sellers
          </Typography>
          <Box component="form" onSubmit={handleSearch} sx={{ mt: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by make, model, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/vehicles')}
              sx={{ mr: 2 }}
            >
              Browse All Vehicles
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/create-listing')}
            >
              List Your Vehicle
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Vehicles Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Vehicles
        </Typography>
        <Grid container spacing={4}>
          {featuredVehicles.map((vehicle) => (
            <Grid item key={vehicle._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/vehicles/${vehicle._id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={vehicle.images[0]}
                  alt={vehicle.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {vehicle.title}
                  </Typography>
                  <Typography color="primary" variant="h6" gutterBottom>
                    ${vehicle.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DirectionsCar sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Speed sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.mileage.toLocaleString()} miles
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.location.city}, {vehicle.location.state}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 