import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  Pagination,
} from '@mui/material';
import { DirectionsCar, Speed, AttachMoney, LocationOn } from '@mui/icons-material';
import axios from 'axios';

const VehicleList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    minPrice: 0,
    maxPrice: 1000000,
    status: 'available',
    location: '',
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    fetchVehicles(page);
  }, [searchParams]);

  const fetchVehicles = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vehicles', {
        params: {
          ...filters,
          page,
          limit: 12,
        },
      });
      setVehicles(response.data.vehicles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setSearchParams((prev) => {
      prev.set(field, value);
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (event, value) => {
    setSearchParams((prev) => {
      prev.set('page', value.toString());
      return prev;
    });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      make: '',
      model: '',
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      minPrice: 0,
      maxPrice: 1000000,
      status: 'available',
      location: '',
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Make"
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                fullWidth
              />
              <TextField
                label="Model"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                fullWidth
              />
              <Typography gutterBottom>Year Range</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={[filters.minYear, filters.maxYear]}
                  onChange={(event, newValue) => {
                    handleFilterChange('minYear', newValue[0]);
                    handleFilterChange('maxYear', newValue[1]);
                  }}
                  valueLabelDisplay="auto"
                  min={1900}
                  max={new Date().getFullYear()}
                  marks
                />
              </Box>
              <Typography gutterBottom>Price Range</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(event, newValue) => {
                    handleFilterChange('minPrice', newValue[0]);
                    handleFilterChange('maxPrice', newValue[1]);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000000}
                  step={1000}
                  marks
                />
              </Box>
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                sx={{ mt: 2 }}
              >
                Reset Filters
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Vehicle List */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {vehicles.map((vehicle) => (
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.location.city}, {vehicle.location.state}
                      </Typography>
                    </Box>
                    <Chip
                      label={vehicle.status}
                      color={
                        vehicle.status === 'available'
                          ? 'success'
                          : vehicle.status === 'sold'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={parseInt(searchParams.get('page')) || 1}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VehicleList; 