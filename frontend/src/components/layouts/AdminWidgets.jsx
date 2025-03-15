import { Avatar, Card, CardContent, Grid2, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const AdminWidgets = ({ label, value, icon, bgcolor }) => {
    //console.log(label)
  return (
    <Grid2 xs={12} sm={12} lg={12}> 
        <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 1, fontWeight: "bold" }}>
                        {value}
                    </Typography>
                </Box>
                <Avatar sx={{ width: 48, height: 48, bgcolor }}>{icon}</Avatar>
            </CardContent>
        </Card>
    </Grid2>
  )
}

export default AdminWidgets