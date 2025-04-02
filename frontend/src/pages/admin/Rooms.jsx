import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { AdminHeaders, AdminTable, AdminTableController } from '../../components/adminComponent'

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const menuActionsList = ["View", "Edit", "Block", "Delete"]
  // Sample data fetching (replace with actual API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleData = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: `Room ${i + 1}`,
        image: `https://picsum.photos/id/${i + 50}/200`,
        type: i % 3 === 0 ? "Standard" : i % 3 === 1 ? "Premium" : "Deluxe",
        capacity: Math.floor(Math.random() * 10) + 1,
        price: `$${(Math.random() * 200 + 50).toFixed(2)}`,
        location: `Floor ${Math.floor(i / 10) + 1}`,
        status: i % 4 === 0 ? "Available" : i % 4 === 1 ? "Booked" : i % 4 === 2 ? "Maintenance" : "Reserved",
      }));
      setRooms(sampleData);
      setFilteredRooms(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter rooms based on search and filters
  const filterRooms = () => {
    let result = [...rooms];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(room => 
        room.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply category filter (room type)
    if (categoryFilter) {
      result = result.filter(room => 
        room.type.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredRooms(result);
  };

  // Handle search button click
  const handleSearchClick = () => {
    filterRooms();
  };

  // Define table columns
  const columns = [
    { field: 'name', headerName: 'Room Name' },
    { field: 'type', headerName: 'Type' },
    { field: 'capacity', headerName: 'Capacity' },
    { field: 'price', headerName: 'Price' },
    { field: 'location', headerName: 'Location' },
  ];

  // Handle row actions
  const handleRowAction = (action, id) => {
    console.log(`Action: ${action} on room ID: ${id}`);
    // Implement actual actions here
  };

  // Handle add new room
  const handleAddRoom = () => {
    console.log("Add new room");
    // Implement logic to add new room
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>    
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AdminHeaders title="Rooms" subtitle="View rooms listed here."/>

          {/* Search and filter controls */}
          <AdminTableController 
            title="Event Management"
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onSearchClick={handleSearchClick}
            searchPlaceholder="Search event name, organizer..."
            categoryOptions={[
              { value: "workshop", label: "Workshop" },
              { value: "conference", label: "Conference" },
              { value: "meetup", label: "Meetup" }
            ]}
            statusOptions={[
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" }
            ]}
          />
        
        {/* Table component displaying filtered data */}
        <AdminTable 
          data={filteredRooms}
          columns={columns}
          onRowAction={handleRowAction}
          menuActions={menuActionsList}
          showStatus={true}
          showImage={true}
        />
        </Box>
    </Box>
  )
}

export default Rooms