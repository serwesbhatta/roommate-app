import React, { useState } from 'react';
import { Avatar, Card, CardContent, IconButton, Typography, Tooltip, Box } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProfileCard = ({ 
  profile, 
  loading = false, 
  onViewProfile = () => {}, 
  getImageUrl = (url) => url // Default pass-through function if not provided
}) => {

  console.log("single profile", profile.profile_image)
  const [isHovering, setIsHovering] = useState(false);
  
  if (loading) {
    return (
      <Card elevation={2} sx={{ 
        borderRadius: 4,
        width: 303,
        height: 354,
        padding: 0,
        margin: 0,
        overflow: 'hidden' 
      }} />
    );
  }

  const profileImage = profile.image || profile.profile_image;
  const displayName = profile.name ||`${profile.first_name} ${profile.last_name}` ||"MSU Student";
  const major = profile.profile?.majors || profile.majors || "Undeclared";
  const gender = profile.profile?.gender || profile.gender;
  const age = profile.profile?.age || profile.age;
  const match = profile.profile?.match || profile.match;
  
  console.log("profileImage",profileImage)
  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 4,
        width: 303,
        height: 354,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 10px 20px rgba(0,0,0,0.1)'
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Compatibility score overlay (visible on hover) */}
      {isHovering && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 220,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 2,
            transition: 'opacity 0.3s ease',
          }}
        >
          {
            match  &&   
            <>
              <Typography variant="h4" fontWeight="bold">
                {match || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                Compatibility
              </Typography>
            </> 
          }
          <Tooltip title="View Profile">
            <IconButton
              sx={{
                backgroundColor: 'white',
                color: '#3498DB',
                width: 45,
                height: 45,
                mt: 2,
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'scale(1.1)'
                }
              }}
              aria-label="view profile"
              onClick={() => onViewProfile(profile.id || profile.user_id)}
            >
              <VisibilityIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ 
        padding: 0, 
        '&:last-child': {
          paddingBottom: 0 
        }
      }}>
        <Box
          sx={{
            width: '100%',
            height: 220,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {profileImage? 
            <img 
              src={getImageUrl(profileImage)}
              alt="Profile" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                display: 'block'
              }}
            />
            :
            <Avatar 
              sx={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: 0,
                bgcolor: '#E0E0E0'
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 120, color: '#555555' }} />
            </Avatar>
          }
        </Box>
        
        <Box sx={{ 
          padding: '16px'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 590,
              fontSize: '18px',
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {displayName}
          </Typography>
          
          {/* Major information */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <strong>Major:</strong> {major}
          </Typography>
          
          {/* Additional profile info */}
          {gender && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <strong>Gender:</strong> {gender}
            </Typography>
          )}
          
          {age && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <strong>Age:</strong> {age}
            </Typography>
          )}
          
          {/* Compatibility badge (visible when not hovering) */}
          {!isHovering && match && (
            <Box 
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                borderRadius: '12px',
                padding: '4px 10px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {match}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;