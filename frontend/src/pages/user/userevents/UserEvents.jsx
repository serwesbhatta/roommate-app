import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { EventsList, EventForm } from "../../../components/events";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApprovedEvents,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../../redux/slices/eventsSlice";

const UserEvents = () => {
  const dispatch = useDispatch();

  const {
    events,
    approvedEvents,
    loading,
    error,
  } = useSelector((state) => state.events);
  const {id} = useSelector((state) => state.auth);
  const currentUserId = id

  const [tabValue, setTabValue] = useState(0);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormState = {
    title: "",
    description: "",
    event_start: "",
    event_end: "",
    location: "",
    requested_by: "",
  };

  const [eventForm, setEventForm] = useState(initialFormState);

  useEffect(() => {
    if (tabValue === 0) {
      dispatch(fetchApprovedEvents());
    } else {
      dispatch(fetchEvents());
    }
  }, [dispatch, tabValue]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const prepareEventData = (formData) => ({
    ...formData,
    event_start: new Date(formData.event_start).toISOString(),
    event_end: new Date(formData.event_end).toISOString(),
    requested_by: currentUserId,
  });

  const handleSubmitRequest = () => {
    const eventData = prepareEventData(eventForm);

    if (isEditMode) {
      dispatch(updateEvent({ id: eventForm.id, data: eventData }));
    } else {
      dispatch(createEvent(eventData));
    }

    setOpenRequestDialog(false);
    setEventForm(initialFormState);
    setIsEditMode(false);
  };

  const handleEditClick = (event) => {
    setEventForm({
      ...event,
      event_start: formatDateTimeForInput(event.event_start),
      event_end: formatDateTimeForInput(event.event_end),
    });
    setIsEditMode(true);
    setOpenRequestDialog(true);
  };

  const handleCancelClick = (eventId) => {
    dispatch(deleteEvent(eventId));
  };

  const formatDateTimeForInput = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toISOString().slice(0, 16);
  };

  const getEvents = () => {
    const base = tabValue === 0 ? approvedEvents : events;
    return tabValue === 1
      ? base.filter(e =>
        Number(e.requested_by) === Number(currentUserId))
      : base;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">MSU Events</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsEditMode(false);
              setEventForm(initialFormState);
              setOpenRequestDialog(true);
            }}
          >
            Request New Event
          </Button>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Events" icon={<CalendarMonthIcon />} iconPosition="start" />
            <Tab label="My Requests" icon={<PersonIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {loading && <Typography>Loading events...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (
          <EventsList
            events={getEvents()}
            onEditClick={handleEditClick}
            onCancelClick={handleCancelClick}
            onRequestClick={() => {
              setIsEditMode(false);
              setEventForm(initialFormState);
              setOpenRequestDialog(true);
            }}
            tabValue={tabValue}
          />
        )}
      </Box>

      <EventForm
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        formData={eventForm}
        onChange={handleFormChange}
        onSubmit={handleSubmitRequest}
        isEdit={isEditMode}
      />
    </Container>
  );
};

export default UserEvents;
