import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Paper
} from '@mui/material';

const RoommateFinderSrcBar = ({ onSearch }) => {

    const [major, setMajor] = useState('');
    const [gender, setGender] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    
    const majors = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine'];
    const genders = ['Male', 'Female', 'Non-binary', 'Other'];
    const years = ['2025', '2026', '2027', '2028', '2029'];

const handleSearch = () => {
    onSearch({
      major,
      gender,
      graduationYear,
    });
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
                value={major}
                label="Major"
                onChange={(e) => setMajor(e.target.value)}
              >
                {majors.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                {genders.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Graduation Year</InputLabel>
              <Select
                labelId="year-label"
                value={graduationYear}
                label="Graduation Year"
                onChange={(e) => setGraduationYear(e.target.value)}
              >
                {years.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleSearch}
            >
              Find Roommate
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RoommateFinderSrcBar