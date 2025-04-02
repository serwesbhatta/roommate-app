import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const BlueButton = ({btuTxt, onClicked}) => {

  const navigate = useNavigate();
  return (
    <Button 
      variant="contained" 
      sx={{ height: "40px", textTransform: "none" }}
      onClick={() => navigate(`${onClicked}`)}
    >

    {btuTxt}
  </Button>
  )
}

export default BlueButton