import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import {
  AdminHeaders,
  AdminTable,
  AdminTableController,
} from "../../components/adminComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  updateEvent,
  deleteEvent,
  createEvent,
} from "../../redux/slices/eventsSlice";
import { EventForm } from "../../components/events";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const { id: currentAdminId } = useSelector((state) => state.auth);

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    event_start: "",
    event_end: "",
    location: "",
    requested_by: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const menuActionsList = ["Add", "Edit", "Approve", "Reject", "Delete"];

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter]);

  const filterEvents = () => {
    let result = [...events];
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.requested_user_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter(
        (event) => event.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    setFilteredEvents(result);
  };

  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDateTimeForInput = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toISOString().slice(0, 16);
  };

  const handleRowAction = (action, id) => {
    const event = filteredEvents.find((e) => e.id === id);
    switch (action) {
      case "delete":
        dispatch(deleteEvent(id));
        break;

      case "approve":
        if (event?.status === "pending" || event?.status === "rejected") {
          const { title, description, event_start, event_end, location } =
            event;

          const payload = {
            title,
            description,
            event_start,
            event_end,
            location,
            status: "approved",
            approved_by: currentAdminId,
            updated_at: new Date().toISOString(),
          };

          dispatch(updateEvent({ id: event.id, data: payload }));
        }
        break;

      case "reject":
        if (event?.status === "pending" || event?.status === "approved") {
          const { title, description, event_start, event_end, location } =
            event;

          const payload = {
            title,
            description,
            event_start,
            event_end,
            location,
            status: "rejected",
            approved_by: currentAdminId,
            updated_at: new Date().toISOString(),
          };

          dispatch(updateEvent({ id: event.id, data: payload }));
        }
        break;

      case "add":
        setIsEditMode(false);
        setEventForm({
          title: "",
          description: "",
          event_start: "",
          event_end: "",
          location: "",
          requested_by: currentAdminId,
        });
        setDialogOpen(true);
        break;

      case "edit":

        setIsEditMode(true);
        setEventForm({
          ...event,
          event_start: formatDateTimeForInput(event.event_start),
          event_end: formatDateTimeForInput(event.event_end),
        });
        setDialogOpen(true);
        break;

      default:
        break;
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {

    const { title, description, location } = eventForm;
    const payload = {
      title,
      description,
      location,
      event_start: new Date(eventForm.event_start).toISOString(),
      event_end: new Date(eventForm.event_end).toISOString(),
    };

    if (isEditMode) {
      const data = {
        ...payload,
        status: "rejected",   
        approved_by: currentAdminId, 
        updated_at: new Date().toISOString(),  
      };
      dispatch(updateEvent({ id: eventForm.id, data }));

    } else {
      const data = {
        ...payload,
        requested_by: currentAdminId
      }
      dispatch(createEvent(data));
    }

    setDialogOpen(false);
    setIsEditMode(false);
    setEventForm({
      title: "",
      description: "",
      event_start: "",
      event_end: "",
      location: "",
      requested_by: currentAdminId,
    });
  };


  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeaders
          title="Events"
          subtitle="Manage all user-submitted events"
          addButtonText="Add Event"
          onAddClick={() => handleRowAction("add")}
        />

        <AdminTableController
          title="Event Management"
          searchPlaceholder="Search title, location, user..."
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onStatusChange={setStatusFilter}
          onSearchClick={filterEvents}
          searchTerm={searchTerm}
          categoryOptions={[]} // placeholder
          statusOptions={[
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
        />

        <AdminTable
          data={filteredEvents}
          columns={[
            { field: "id", headerName: "ID" },
            { field: "title", headerName: "Title" },
            { field: "location", headerName: "Location" },
            {
              field: "event_start",
              headerName: "Start",
              render: (value) => formatDateTime(value),
            },
            {
              field: "event_end",
              headerName: "End",
              render: (value) => formatDateTime(value),
            },
            {
              field: "requested_user_name",
              headerName: "Requested By",
              render: (value) => value || "N/A",
            },
            {
              field: "approved_user_name",
              headerName: "Approved By",
              render: (value) => value || "—",
            },
            {
              field: "description",
              headerName: "Description",
              render: (value) => {
                const maxLength = 60;
                const shortText =
                  value?.length > maxLength
                    ? value.slice(0, maxLength) + "..."
                    : value;
                return (
                  <Tooltip title={value || "No description"} arrow>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                        display: "inline-block",
                      }}
                    >
                      {shortText || "—"}
                    </Typography>
                  </Tooltip>
                );
              },
            },
            {
              field: "status",
              headerName: "Status",
              render: (value) => (
                <Button
                  size="small"
                  variant="contained"
                  color={
                    value === "approved"
                      ? "success"
                      : value === "rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {value}
                </Button>
              ),
            },
          ]}
          onRowAction={handleRowAction}
          menuActions={menuActionsList}
          showImage={false}
        />
      </Box>

      {/* Event Form Dialog */}
      <EventForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formData={eventForm}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        isEdit={isEditMode}
      />
    </Box>
  );
};

export default Events;
