import { Avatar, Card, CardContent, IconButton, Typography} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import TelegramIcon from '@mui/icons-material/Telegram'; // This looks more like the right-facing icon
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import person from '../../assets/person.jpg';

const ProfileCard = ({ profile }) => {
    return (
      <Card elevation={2} sx={{ 
        borderRadius: 4,
        width: 303,
        height:354,
        padding: 0,
        margin: 0,
        overflow: 'hidden' 
      }}>
        <CardContent sx={{ 
          padding: 0, // Remove all padding from CardContent
          '&:last-child': {
            paddingBottom: 0 // Override MUI's default padding
          }
        }}>
          <Box
            sx={{
              width: '100%',
              height: 220, // Fixed height for image section
              overflow: 'hidden', // Contain the image
              position: 'relative' // For positioning the image
            }}
          >
            {person ? 
              <img 
                src={person} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'cover', 
                  display: 'block'
                }}
              />
              :
              <Avatar 
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  borderRadius: 0,
                  bgcolor: '#E0E0E0'
                }}
              >
                <PersonOutlineIcon sx={{ fontSize: 120, color: '#555555' }} />
              </Avatar>
            }
          </Box>
          
          <Box  sx={{ 
              padding: '12px 16px'
           }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2,
                fontWeight: 590,
                fontSize:'18px',
                textAlign: 'left'
              }}
            >
              {profile.name || "John Doe"}
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              //px: 2,
              //mb: 1
            }}>
              {/* Match circle */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 45,
                height: 45,
                borderRadius: '50%',
                border: '2px solid #F5B041'
              }}>
                <Typography 
                  color="#F5B041" 
                  fontWeight="bold" 
                  variant="body2"
                >
                  {profile.match || "80%"} 
                </Typography>
              </Box>

              <Box>
                {/* Telegram button */}
                <IconButton
                  sx={{
                    backgroundColor: '#3498DB',
                    color: 'white',
                    width: 45,
                    height: 45,
                    '&:hover': { backgroundColor: '#2980B9' }
                  }}
                >
                  <TelegramIcon sx={{ fontSize: 28 }} />
                </IconButton>
                
                {/* Person button */}
                <IconButton
                  sx={{
                    backgroundColor: 'transparent',
                    border: '2px solid #DDDDDD',
                    color: '#999999',
                    width: 45,
                    height: 45,
                    '&:hover': { backgroundColor: '#F9F9F9' }
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
};

export default ProfileCard