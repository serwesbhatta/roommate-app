import React from 'react';
import { Card, Typography, TextField, Button, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Roomate from '../../assets/roommates.jpg';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent",
        padding: '0 90px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '60%', 
          borderRadius: '12px',
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            height: '100%',
            borderRadius: '12px 0 0 12px',
            overflow: 'hidden', 
          }}
        >
          <img
            src={Roomate}
            alt="Sign In"
            style={{
              width: '100%',
              height: 'auto', 
            }}
          />
        </Box>

        {/* Right Side - Sign In Form */}
        <Card
          sx={{
            padding: 4,
            borderRadius: '0 12px 12px 0',
            flex: 1,
            //height: '100%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#FF9800',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Sign In
            </Typography>

            <TextField fullWidth label="MSU Email" variant="outlined" sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 2 }} />

            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: '#1976D2', color: '#FFF', mb: 2 }}
            >
              Sign In
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
              Do not have an account?{' '}
              <Link
                href="/signup"
                sx={{ color: '#1976D2', fontWeight: 'bold', textDecoration: 'none' }}
              >
                Sign Up
              </Link>
            </Typography>

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', display: 'block', mt: 2, color: '#999' }}
            >
              By clicking on Sign up, you agree to our <Link href="#">Terms of service</Link> and{' '}
              <Link href="#">Privacy policy</Link>.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
