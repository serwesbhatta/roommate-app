import { Box } from '@mui/system'
import React from 'react'
import { AdminHeaders } from '../../components/commons'

const Notifications = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>    
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AdminHeaders title="Notifications" subtitle="View your notifications here."/>
        </Box>
    </Box>
  )
}

export default Notifications