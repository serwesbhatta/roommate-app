import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({title, menuItems }) => {

    const isMobile = useMediaQuery('(max-width:600px)');
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

  return (
    // <div>Navbar</div>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {isMobile ? (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={handleMenuClose} href={item.link}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        ) : (
          menuItems.map((item, index) => (
            <Button key={index} color="inherit" href={item.link}>
              {item.label}
            </Button>
          ))
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar