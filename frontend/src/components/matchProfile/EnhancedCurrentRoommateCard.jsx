import { Avatar, Button, Chip, Paper, Rating, Typography } from '@mui/material'
import { Box, Grid } from '@mui/system'
import React from 'react'

const EnhancedCurrentRoommateCard = ({ roommate }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2}}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={roommate.photo}
              alt={roommate.name}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={roommate.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({roommate.reviews})
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="h6" gutterBottom>
            {roommate.name}
            <Chip size="small" label="Current" color="success" sx={{ ml: 2 }} />
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Major</Typography>
              <Typography variant="body1">{roommate.major}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Graduation Year</Typography>
              <Typography variant="body1">{roommate.graduationYear}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Gender</Typography>
              <Typography variant="body1">{roommate.gender}</Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" size="small">View Profile</Button>
            <Button variant="outlined" size="small" sx={{ ml: 2 }}>
              Message
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default EnhancedCurrentRoommateCard


