import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  AdminHeaders,
  AdminTable,
  AdminTableController,
} from "../../components/adminComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  deleteRoom,
  fetchTotalRooms,
  createRoom,
  updateRoom,
  allocateStudents,
  vacateRoom,
} from "../../redux/slices/roomSlice";
import { fetchResidenceHalls } from "../../redux/slices/residenceHallSlice";
import { RoomForm } from "../../components/accommodations";

const Rooms = () => {
  const dispatch = useDispatch();
  const { roomList, totalRooms, loading, error } = useSelector((state) => state.rooms);
  const { residenceHalls } = useSelector((state) => state.residenceHall);

  // Local states for filtering parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Local pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Local state for filtered room list
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Local state for managing the RoomForm dialog and error message
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [roomFormAction, setRoomFormAction] = useState("");
  const [roomFormData, setRoomFormData] = useState({
    room_number: "",
    room_type: "",
    room_status: "",
    capacity: "",
    price: "",
    is_available: true,
    lease_end: "",
    residence_hall_id: "",
    student_ids: [],
  });
  const [roomFormError, setRoomFormError] = useState("");

  // Fetch total rooms and residence halls on mount
  useEffect(() => {
    dispatch(fetchTotalRooms());
    dispatch(fetchResidenceHalls({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Build category options from residence halls (for filtering by hall)
  const categoryOptions = residenceHalls
    ? residenceHalls.map((hall) => ({
        value: hall.id,
        label: hall.name,
      }))
    : [];

  // Fetch rooms when page or rowsPerPage changes.
  useEffect(() => {
    const skip = page * rowsPerPage;
    dispatch(fetchRooms({ skip, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  // Apply local filtering on fetched rooms.
  useEffect(() => {
    let result = [...roomList];
    if (searchTerm) {
      result = result.filter((room) =>
        room.room_number.toString().includes(searchTerm.toLowerCase()) ||
        (room.room_type &&
          room.room_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (room.location &&
          room.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter) {
      result = result.filter(
        (room) =>
          room.room_status &&
          room.room_status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (categoryFilter) {
      result = result.filter(
        (room) => room.residence_hall_id === Number(categoryFilter)
      );
    }
    setFilteredRooms(result);
  }, [roomList, searchTerm, categoryFilter, statusFilter]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Table columns definition
  const columns = [
    { field: "room_number", headerName: "Room Number" },
    { field: "room_type", headerName: "Room Type" },
    { field: "capacity", headerName: "Capacity" },
    {
      field: "price",
      headerName: "Price",
      render: (value) => `$${value}`,
    },
    { field: "current_occupants", headerName: "Occupants" },
    {
      field: "is_available",
      headerName: "Available",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      field: "lease_end",
      headerName: "Lease End",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "room_status",
      headerName: "Status",
      render: (value) => (
        <Button
          size="small"
          variant="contained"
          color={
            value === "available" || value === "partially_occupied"
              ? "success"
              : value === "full" || value === "maintenance"
              ? "error"
              : "warning"
          }
        >
          {value}
        </Button>
      ),
    },
    {
      field: "user_profiles",
      headerName: "Users",
      render: (users) => {
        const joinedEmails = Array.isArray(users)
          ? users.map((user) => user.msu_email).join(", ")
          : "";
        const maxLength = 6;
        const shortText =
          joinedEmails.length > maxLength
            ? joinedEmails.slice(0, maxLength) + "..."
            : joinedEmails;
        return (
          <Tooltip title={joinedEmails || "No Users"} arrow>
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
  ];

  // Helper function to refresh room data (total count and current list)
  const refreshRoomsData = () => {
    dispatch(fetchTotalRooms());
    const skip = page * rowsPerPage;
    dispatch(fetchRooms({ skip, limit: rowsPerPage }));
  };

  // Function to open RoomForm dialog; if a room is provided, pre-populate for edit/allocate/vacate.
  const openRoomForm = (action, room = null) => {
    setRoomFormAction(action);
    setRoomFormError(""); // Clear any previous errors
    if (room) {
      setRoomFormData(room);
    } else {
      setRoomFormData({
        room_number: "",
        room_type: "",
        capacity: "",
        price: "",
        lease_end: "",
        residence_hall_id: "",
        room_status: "",
        student_ids: "",
      });
    }
    setRoomFormOpen(true);
  };

  // Extended handleRowAction including "add"
  const handleRowAction = (action, id) => {
    console.log(`Action: ${action} on room with identifier: ${id}`);
    const room = filteredRooms.find((r) => r.room_number === id);
    if (!room) return;
    switch (action.toLowerCase()) {
      case "delete":
        dispatch(
          deleteRoom({
            residenceHallId: room.residence_hall_id,
            roomNumber: room.room_number,
          })
        )
          .unwrap()
          .then(() => {
            refreshRoomsData();
          })
          .catch((error) => {
            console.error("Failed to delete room:", error);
          });
        break;
      case "edit":
        openRoomForm("edit", room);
        break;
      case "allocate":
        openRoomForm("allocate", room);
        break;
      case "vacate":
        openRoomForm("vacate", room);
        break;
      default:
        break;
    }
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomFormSubmit = async () => {
    // Branch based on the action type.
    if (roomFormAction === "allocate" || roomFormAction === "vacate") {
      // Convert the student_ids field from a comma-separated string to an array of numbers.
      const studentIdsString = roomFormData.student_ids || "";
      const studentIdsArray = studentIdsString
        .split(",")
        .map((item) => parseInt(item.trim(), 10))
        .filter((item) => !isNaN(item));

      if (studentIdsArray.length === 0) {
        setRoomFormError("Please provide valid student IDs.");
        return;
      }

      let resultAction;
      if (roomFormAction === "allocate") {
        resultAction = await dispatch(
          allocateStudents({
            residence_hall_id: roomFormData.residence_hall_id,
            room_number: roomFormData.room_number,
            student_ids: studentIdsArray,
          })
        );
      } else if (roomFormAction === "vacate") {
        resultAction = await dispatch(
          vacateRoom({
            residence_hall_id: roomFormData.residence_hall_id,
            room_number: roomFormData.room_number,
            student_ids: studentIdsArray,
          })
        );
      }

      if (
        (roomFormAction === "allocate" && allocateStudents.fulfilled.match(resultAction)) ||
        (roomFormAction === "vacate" && vacateRoom.fulfilled.match(resultAction))
      ) {
        setRoomFormError("");
        setRoomFormOpen(false);
        refreshRoomsData();
      } else {
        const errorMsg =
          resultAction.payload?.detail ||
          resultAction.payload ||
          resultAction.error?.message ||
          "Operation failed. Please check the student IDs.";
        setRoomFormError(errorMsg);
      }
    } else if (roomFormAction === "add") {
      // For add, build your payload from the form data.
      const addPayload = {
        room_number: roomFormData.room_number,
        room_type: roomFormData.room_type,
        capacity: roomFormData.capacity,
        is_available: roomFormData.is_available,
        price: roomFormData.price,
        lease_end: roomFormData.lease_end,
        residence_hall_id: roomFormData.residence_hall_id,
        room_status: roomFormData.room_status,
      };
      try {
        await dispatch(createRoom(addPayload)).unwrap();
        setRoomFormError("");
        setRoomFormOpen(false);
        refreshRoomsData();
      } catch (error) {
        setRoomFormError(error?.detail || error?.message || "Creation failed.");
      }
    } else if (roomFormAction === "edit") {
      const isAvailable =
        !(roomFormData.room_status &&
          ["full", "maintenance"].includes(roomFormData.room_status.toLowerCase()));
      const updatePayload = {
        room_number: roomFormData.room_number,
        room_type: roomFormData.room_type,
        capacity: roomFormData.capacity,
        price: roomFormData.price,
        lease_end: roomFormData.lease_end,
        residence_hall_id: roomFormData.residence_hall_id,
        room_status: roomFormData.room_status,
        is_available: isAvailable,
      };

      try {
        await dispatch(
          updateRoom({
            residenceHallId: roomFormData.residence_hall_id,
            roomNumber: roomFormData.room_number,
            updateData: updatePayload,
          })
        ).unwrap();
        setRoomFormError("");
        setRoomFormOpen(false);
        refreshRoomsData();
      } catch (error) {
        setRoomFormError(error?.detail || error?.message || "Update failed.");
      }
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeaders
          title="Rooms"
          subtitle="View room details and manage room records."
        />

        {/* Search and Filter Controls */}
        <AdminTableController
          title="Room Management"
          searchPlaceholder="Search by room number, type, or location..."
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onSearchClick={() => {}}
          categoryOptions={categoryOptions}
          statusOptions={[
            { value: "available", label: "Available" },
            { value: "partially_occupied", label: "Partially Occupied" },
            { value: "full", label: "Full" },
            { value: "maintenance", label: "Maintenance" },
          ]}
          onAddClick={() => openRoomForm("add")}
        />
        <AdminTable
          data={filteredRooms}
          columns={columns}
          onRowAction={handleRowAction}
          menuActions={["Edit", "Allocate", "Vacate", "Delete"]}
          showStatus={false}
          showImage={false}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          count={totalRooms}
        />
      </Box>

      {/* RoomForm Dialog for Add/Edit/Allocate/Vacate */}
      {roomFormOpen && (
        <RoomForm
          open={roomFormOpen}
          onClose={() => setRoomFormOpen(false)}
          formData={roomFormData}
          onChange={handleRoomFormChange}
          onSubmit={handleRoomFormSubmit}
          actionType={roomFormAction}
          residenceHallOptions={categoryOptions}
          formError={roomFormError} // Passing error message to the form
        />
      )}
    </Box>
  );
};

export default Rooms;
