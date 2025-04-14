import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResidenceHalls,
  createResidenceHall,
  updateResidenceHall,
  deleteResidenceHall,
  fetchTotalHalls,
} from "../../redux/slices/residenceHallSlice";
import {
  AdminHeaders,
  AdminTable,
  AdminTableController,
} from "../../components/adminComponent";
import { ResidenceHallForm } from "../../components/accommodations";

const ResidenceHall = () => {
  const dispatch = useDispatch();
  // Extract residence hall data from the Redux store
  const { residenceHalls, totalHalls, loading, error } = useSelector(
    (state) => state.residenceHall
  );

  // Local states for search, form data, dialog visibility, and edit mode
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hallForm, setHallForm] = useState({
    id: null,
    name: "",
    address: "",
    amenities: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // or any default value

  // Define the menu actions for each table row
  const menuActionsList = ["Edit", "Delete"];

  // Fetch total halls on mount
  useEffect(() => {
    dispatch(fetchTotalHalls());
  }, [dispatch]);

  // Fetch residence hall data on mount and whenever pagination changes.
  useEffect(() => {
    const skip = page * rowsPerPage;
    dispatch(fetchResidenceHalls({ skip, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  // Filter the halls based on the search term.
  useEffect(() => {
    let result = [...residenceHalls];
    if (searchTerm) {
      result = result.filter(
        (hall) =>
          hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hall.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredHalls(result);
  }, [residenceHalls, searchTerm]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper function to refresh data
  const refreshHallsData = () => {
    dispatch(fetchTotalHalls());
    const skip = page * rowsPerPage;
    dispatch(fetchResidenceHalls({ skip, limit: rowsPerPage }));
  };

  // Handle actions: edit, delete, and add.
  const handleRowAction = (action, id) => {
    if (action.toLowerCase() === "delete") {
      // Delete a record then refresh the data
      dispatch(deleteResidenceHall(id)).then(() => {
        refreshHallsData();
      });
    } else if (action.toLowerCase() === "edit") {
      const hall = filteredHalls.find((h) => h.id === id);
      setIsEditMode(true);
      setHallForm({
        id: hall.id,
        name: hall.name,
        address: hall.address,
        amenities: hall.amenities || "",
      });
      setDialogOpen(true);
    } else if (action.toLowerCase() === "add") {
      setIsEditMode(false);
      setHallForm({
        id: null,
        name: "",
        address: "",
        amenities: "",
      });
      setDialogOpen(true);
    }
  };

  // Handle form input changes.
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setHallForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit for both create and update operations.
  const handleFormSubmit = () => {
    const data = {
      name: hallForm.name,
      address: hallForm.address,
      amenities: hallForm.amenities,
    };

    if (isEditMode) {
      dispatch(updateResidenceHall({ id: hallForm.id, data })).then(() => {
        refreshHallsData();
      });
    } else {
      dispatch(createResidenceHall(data)).then(() => {
        refreshHallsData();
      });
    }

    setDialogOpen(false);
    setIsEditMode(false);
    setHallForm({
      id: null,
      name: "",
      address: "",
      amenities: "",
    });
  };

  // Define the columns for the table.
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "address", headerName: "Address" },
    { field: "amenities", headerName: "Amenities" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeaders
          title="Residence Halls"
          subtitle="Manage all residence hall records"
        />
        {/* Table controller with search and add button */}
        <AdminTableController
          title="Residence Hall Management"
          searchPlaceholder="Search name, address..."
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchTerm={searchTerm}
          categoryOptions={[]}
          statusOptions={[]}
          onAddClick={() => handleRowAction("add")}
        />
        <AdminTable
          data={filteredHalls}
          columns={columns}
          onRowAction={handleRowAction}
          menuActions={menuActionsList}
          showStatus={false}
          showImage={false}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          count={totalHalls}
        />
        <ResidenceHallForm
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          formData={hallForm}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          isEdit={isEditMode}
        />
      </Box>
    </Box>
  );
};

export default ResidenceHall;
