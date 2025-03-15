import { Box } from '@mui/system'
import React from 'react'
import { AdminHeader } from '../../components/commons'

const Inbox = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>    
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AdminHeader title="Inbox" subtitle="View your message here."/>
        </Box>
    </Box>
  )
}

export default Inbox