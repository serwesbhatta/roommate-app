import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Paper,
  TextField
} from '@mui/material';

const RoommateFinderSrcBar = ({ onSearch, setSearchParams }) => {
  const [filters, setFilters] = useState({
    major: '',
    gender: '',
    age: ''
  });

  const majors = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine', 'Biology', 'Psychology'];
  const genders = ['Male', 'Female', 'Non-binary', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    // Clean up empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      major: '',
      gender: '',
      age: ''
    });
    setSearchParams({});
  };

  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="major-label">Major</InputLabel>
              <Select
                labelId="major-label"
                name="major"
                value={filters.major}
                label="Major"
                onChange={handleChange}
              >
                <MenuItem value="">Any Major</MenuItem>
                {majors.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={filters.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="">Any Gender</MenuItem>
                {genders.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={filters.age}
              onChange={handleChange}
              inputProps={{ min: 18, max: 99 }}
            />
          </Grid>
          
          {/* This will push the buttons to the right */}
          <Grid item xs={12} sm={true}></Grid>
          
          <Grid item xs={12} sm="auto">
            <Box display="flex" gap={2}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleReset}
                sx = {{p:2}}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSearch}
                disabled={!filters.major && !filters.gender && !filters.age}
                sx = {{p:2}}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RoommateFinderSrcBar;