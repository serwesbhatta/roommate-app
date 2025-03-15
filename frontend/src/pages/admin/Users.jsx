import React from 'react'
import { AdminHeader, AdminTable, AdminTableController } from '../../components/commons'
import { Box } from '@mui/system'

const Users = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>    
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AdminHeader title="Users" subtitle="View users listed here."/>
            <AdminTableController/>
            <AdminTable/>
        </Box>
    </Box>
  )
}

export default Users