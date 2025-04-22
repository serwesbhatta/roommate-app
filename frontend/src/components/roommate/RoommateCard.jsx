
import React from 'react';
import { 
  Avatar, Box, Button, Card, CardActions, CardContent, 
  Chip, Divider, Typography 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from "../../utils/imageURL";

const RoommateCard = ({ 
  roommate, 
  onViewProfile, 
  onMessage, 
  onFeedback, 
  gridView = false 
}) => (
  <Card 
    elevation={4} 
    sx={{ 
      height: '100%',
      mb: gridView ? 0 : 3, 
      borderRadius: 3, 
      transition: 'transform 0.3s, box-shadow 0.3s', 
      '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center">
        <Avatar 
          src={getImageUrl(roommate?.profile_image || "/default-avatar.png")}
          alt={`${roommate.first_name} ${roommate.last_name}`}
          sx={{ width: 72, height: 72, mr: 3, border: '2px solid', borderColor: 'primary.main' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {roommate.first_name} {roommate.last_name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {roommate.majors}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Chip 
              label={roommate.gender} 
              size="small" 
              sx={{ 
                mr: 1, 
                backgroundColor: roommate.gender === 'Male' ? 'lightblue' : 'secondary.light', 
                color: 'secondary.contrastText'
              }} 
            />
            <Chip 
              label={`Age: ${roommate.age}`} 
              size="small" 
              color="info" 
            />
          </Box>
        </Box>
      </Box>
      {roommate.bio && (
        <Box mt={2}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Bio
          </Typography>
          <Typography variant="body2" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {roommate.bio}
          </Typography>
        </Box>
      )}
    </CardContent>

    <CardActions sx={{ p: 2, m: 2 }}>
      <Button 
        startIcon={<StarIcon />} 
        variant="outlined" 
        size="small"
        onClick={() => onFeedback(roommate)}
        sx={{ textTransform: 'none' }}
      >
       Give Feedback
      </Button>
    </CardActions>
  </Card>
);

export default RoommateCard;