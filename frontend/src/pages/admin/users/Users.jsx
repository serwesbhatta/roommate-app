import React, { useState, useEffect } from "react";
import {
  AdminHeaders,
  AdminTable,
  AdminTableController,
} from "../../../components/commons";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { getUserColumnsNames } from "../../../utils/tableColumns";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const menuActionsList = ["View", "Edit", "Block", "Delete"]

  const navigate = useNavigate();

  // Sample data fetching 
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        image: `https://randomuser.me/api/portraits/${
          i % 2 === 0 ? "women" : "men"
        }/${i % 10}.jpg`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        date: "January 1, 2024",
        phone: `555-010${i}`,
        amount: `$${(Math.random() * 100).toFixed(2)}`,
        status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive",
      }));
      setUsers(sampleData);
      setFilteredUsers(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter users based on search and filters
  const filterUsers = () => {
    let result = [...users];

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(
        (user) => user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredUsers(result);
  };

  // Handle search button click
  const handleSearchClick = () => {
    filterUsers();
  };

  // Handle row actions
  const handleRowAction = (action, id) => {
    console.log(`Action: ${action} on user ID: ${id}`);

  };

  // Handle bulk actions
  const handleBulkAction = (action, selectedIds) => {
    console.log(`Bulk action: ${action} on user IDs:`, selectedIds);

  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Admin header with add button */}
        <AdminHeaders
          title="Users"
          subtitle="View and manage user accounts"
          addButtonText="Add User"
          onAddClick="/admin/admin_users/add_user"
        />

        {/* Search and filter controls */}
        <AdminTableController
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onSearchClick={handleSearchClick}
          searchPlaceholder="Search by name, email..."
          categoryOptions = {[
            { value: "users", label: "Users" },
            { value: "rooms", label: "Rooms" },
            { value: "events", label: "Events" }
          ]}
          statusOptions={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" },
          ]}
        />

        {/* Table component displaying filtered data */}
        <AdminTable
          data={filteredUsers}
          menuActions = {menuActionsList}
          columns={getUserColumnsNames}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          showStatus={true}
          showImage={true}
        />
      </Box>
    </Box>
  );
};

export default Users;
