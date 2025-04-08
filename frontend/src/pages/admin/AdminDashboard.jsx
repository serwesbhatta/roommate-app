import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  MenuItem,
  FormControl,
  Select,
  Grid2,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Inbox as InboxIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {AdminWidgets, AdminHeaders} from '../../components/adminComponent'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalEventCount, fetchPendingEvents,  fetchEvents } from '../../redux/slices/eventsSlice';




// Sample data for chart
const newUsersData = [
  { name: '5k', value: 20 },
  { name: '10k', value: 30 },
  { name: '15k', value: 45 },
  { name: '20k', value: 40 },
  { name: '25k', value: 100 },
  { name: '30k', value: 50 },
  { name: '35k', value: 30 },
  { name: '40k', value: 45 },
  { name: '45k', value: 70 },
  { name: '50k', value: 60 },
  { name: '55k', value: 55 },
  { name: '60k', value: 60 }
];



const AdminDashboard = () => {

  const dispatch = useDispatch();
  const { events, pendingEvents, totalCount } = useSelector((state) => state.events);
  const topEvents = events.slice(0, 4);

  
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchTotalEventCount());
    dispatch(fetchPendingEvents());
  }, [dispatch]);


  const [month, setMonth] = useState('October');

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };


const statsData = [
  { label: "Total User", value: 782, icon: <PersonIcon sx={{ color: "#2196f3" }} />, bgcolor: "#e3f2fd" },
  { label: "Total Rooms", value: 234, icon: <RoomIcon sx={{ color: "#ffc107" }} />, bgcolor: "#fff8e1" },
  { label: "Available Rooms", value: 54, icon: <RoomIcon sx={{ color: "#4caf50" }} />, bgcolor: "#e8f5e9" },
  { label: "Total Events", value: totalCount, icon: <EventIcon sx={{ color: "#3f51b5" }} />, bgcolor: "#e8eaf6" },
  { label: "Pending Events", value: pendingEvents.length, icon: <EventIcon sx={{ color: "#ff5252" }} />, bgcolor: "#ffebee" },
];


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>      
        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeaders title="Dashboard" subtitle="View your analytics here."/>

            
            {/* Stat cards */}
            <Grid2 container spacing={3} mb={3} >
                {statsData.map((stat, index) => (
                <AdminWidgets key={index} {...stat} />
                ))}
            </Grid2>
            
            {/* Chart section */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    New Users
                    </Typography>
                    <FormControl size="small" sx={{ width: 120 }}>
                    <Select value={month} onChange={handleMonthChange}>
                        <MenuItem value="October">October</MenuItem>
                        <MenuItem value="November">November</MenuItem>
                        <MenuItem value="December">December</MenuItem>
                    </Select>
                    </FormControl>
                </Box>
                
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={newUsersData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(value) => `${value}%`} 
                            domain={[0, 100]} 
                        />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2196f3" 
                            strokeWidth={2} 
                            dot={{ strokeWidth: 2, r: 4 }}
                            activeDot={{ strokeWidth: 0, r: 6 }}
                            isAnimationActive={true}
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
            
            
          {/* Events table */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Events
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Date - Time</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {event.title}
                        </Box>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {new Date(event.event_start).toLocaleDateString()} - {new Date(event.event_start).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{event.requested_user_name || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          color={
                            event.status === 'approved'
                              ? 'success'
                              : event.status === 'pending'
                              ? 'warning'
                              : 'error'
                          }
                          sx={{ borderRadius: 5 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

        </Box>
    </Box>
  );
};

export default AdminDashboard;