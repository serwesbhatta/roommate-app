import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { AdminHeaders, AdminTable, AdminTableController } from '../../components/commons';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const menuActionsList = ["View", "Edit", "Block", "Delete"]

  // Sample data fetching (replace with actual API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Event ${i + 1}`,
        image: `https://picsum.photos/id/${i + 20}/200`,
        organizer: `Organizer ${(i % 5) + 1}`,
        location: `Location ${(i % 8) + 1}`,
        date: `March ${i + 1}, 2025`,
        attendees: Math.floor(Math.random() * 150),
        status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Cancelled",
      }));
      setEvents(sampleData);
      setFilteredEvents(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter events based on search and filters
  const filterEvents = () => {
    let result = [...events];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(event => 
        event.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply category filter (in a real app, this might filter by event type)
    if (categoryFilter) {
      // Apply event type filtering logic here
    }
    
    setFilteredEvents(result);
  };

  // Handle search button click
  const handleSearchClick = () => {
    filterEvents();
  };

  // Define table columns
  const columns = [
    { field: 'title', headerName: 'Event Name' },
    { field: 'organizer', headerName: 'Organizer' },
    { field: 'location', headerName: 'Location' },
    { field: 'date', headerName: 'Date' },
    { field: 'attendees', headerName: 'Attendees' },
  ];

  // Handle row actions
  const handleRowAction = (action, id) => {
    console.log(`Action: ${action} on event ID: ${id}`);
    // Implement actual actions here
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>    
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Admin header with add button */}
        <AdminHeaders 
          title="Events"
          subtitle="View and manage events."
          addButtonText="Add Events"
          onAddClick="/admin/events/add_user"
        />
        
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
          data={filteredEvents}
          columns={columns}
          onRowAction={handleRowAction}
          menuActions={menuActionsList}
          showStatus={true}
          showImage={true}
        />
      </Box>
    </Box>
  );
};

export default Events;