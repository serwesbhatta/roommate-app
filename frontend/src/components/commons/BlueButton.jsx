import { Button } from '@mui/material'
import React from 'react'

const BlueButton = ({btuTxt, onClicked}) => {
  return (
    <Button 
        variant="contained" 
        sx={{ height: "40px", textTransform: "none" }}>
        {/* onClick={onAddNew} */}
    {btuTxt}
  </Button>
  )
}

export default BlueButton