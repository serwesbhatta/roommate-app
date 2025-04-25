import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
} from "@mui/material";
import {
  AdminHeaders,
  AdminTable,
  AdminTableController,
} from "../../../components/adminComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAuthUsers,
  fetchTotalAuthUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../../redux/slices/authSlice";
import {
  fetchAllUserProfiles,
  fetchTotalUserProfiles,
  fetchUserProfile,
  updateUserProfile,
} from "../../../redux/slices/userSlice";
import { getImageUrl } from "../../../utils/imageURL";

const Users = () => {
  const dispatch = useDispatch();
  const {
    allUsers,
    totalUsers,
    status: authStatus,
  } = useSelector((s) => s.auth);
  const {
    profiles,
    totalProfiles,
    status: profileStatus,
  } = useSelector((s) => s.user);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // User form state and errors
  const [userForm, setUserForm] = useState({
    msu_email: "",
    password: "",
    role: "user",
    id: "",
  });
  const [userFormErrors, setUserFormErrors] = useState({});

  // Profile form state and errors
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    msu_id: "",
    msu_email: "",
    profile_image: null,
    user_id: "",
    age: "",
    gender: "",
    move_in_date: "",
    bio: "",
    majors: "",
  });
  const [profileFormErrors, setProfileFormErrors] = useState({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Row‐level menu actions (no "Add" here because the header Add button does that)
  const menuActionsList = ["Edit", "Delete", "View Profile"];

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    const skip = page * rowsPerPage;
    dispatch(fetchAllAuthUsers({ skip, limit: rowsPerPage }));
    dispatch(fetchTotalAuthUsers());
    dispatch(fetchAllUserProfiles({ skip, limit: rowsPerPage }));
    dispatch(fetchTotalUserProfiles());
  }, [dispatch, page, rowsPerPage]);

  // Filter by search term and role filter
  useEffect(() => {
    let result = [...allUsers];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.msu_email.toLowerCase().includes(term) ||
          (u.first_name && u.first_name.toLowerCase().includes(term)) ||
          (u.last_name && u.last_name.toLowerCase().includes(term))
      );
    }
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [allUsers, searchTerm, roleFilter]);

  const refreshData = () => {
    const skip = page * rowsPerPage;
    dispatch(fetchAllAuthUsers({ skip, limit: rowsPerPage }));
    dispatch(fetchTotalAuthUsers());
    dispatch(fetchAllUserProfiles({ skip, limit: rowsPerPage }));
    dispatch(fetchTotalUserProfiles());
  };

  // Header Add button: Open empty user dialog
  const handleAdd = () => {
    setIsEditMode(false);
    setActiveTab("users");
    setUserForm({ msu_email: "", password: "", role: "user", id: "" });
    setUserFormErrors({});
    setDialogOpen(true);
  };

  // Row action: Delete, Edit, or View Profile
  const handleRowAction = (action, id) => {
    const act = action.toLowerCase();
    const user = allUsers.find((u) => u.id === id);
    if (act === "delete") {
      dispatch(deleteUser(id))
        .unwrap()
        .then(refreshData)
        .catch((e) => console.error("Delete failed:", e));
    }
    if (act === "edit") {
      setIsEditMode(true);
      setActiveTab("users");
      setUserForm({
        msu_email: user.msu_email,
        password: "",
        role: user.role,
        id: user.id,
      });
      setUserFormErrors({});
      setDialogOpen(true);
    }
    if (act === "view profile") {
      setIsEditMode(true);
      setActiveTab("profiles");
      dispatch(fetchUserProfile(id))
        .unwrap()
        .then((profile) => {
          setProfileForm({ ...profile, user_id: id });
          setProfileFormErrors({});
          // Use the backend URL if available, otherwise clear the preview.
          setProfileImagePreview(profile.profile_image || null);
          setDialogOpen(true);
        })
        .catch(() => {
          // No profile exists yet → create an empty profile form for this user.
          setProfileForm({
            first_name: "",
            last_name: "",
            msu_id: "",
            msu_email: user.msu_email,
            profile_image: null,
            user_id: id,
            age: "",
            gender: "",
            move_in_date: "",
            bio: "",
            majors: "",
          });
          setProfileFormErrors({});
          setProfileImagePreview(null);
          setDialogOpen(true);
        });
    }
  };

  // Email cell with tooltip & truncation
  const EmailCell = ({ value }) => (
    <Tooltip title={value}>
      <Typography noWrap sx={{ maxWidth: 120 }}>
        {value}
      </Typography>
    </Tooltip>
  );

  // Combine auth users with their corresponding profile data
  const displayUsers = filteredUsers.map((u) => {
    const p = profiles.find((x) => x.user_id === u.id) || {};
    return {
      ...u,
      first_name: p.first_name || "—",
      last_name: p.last_name || "—",
      msu_id: p.msu_id || "—",
      profile_image: p.profile_image || null,
      age: p.age || "-",
      gender: p.gender || "-",
      move_in_date: p.move_in_date || "-",
      bio: p.bio || "-",
      majors: p.majors || "-",
    };
  });

  // Validation helpers for user & profile forms
  const validateUserForm = () => {
    const errors = {};
    if (!userForm.msu_email) errors.msu_email = "Email is required";
    if (!userForm.role) errors.role = "Role is required";
    if (!isEditMode && !userForm.password) {
      errors.password = "Password is required";
    }
    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileForm.first_name) errors.first_name = "First name is required";
    if (!profileForm.last_name) errors.last_name = "Last name is required";
    if (!profileForm.msu_id) errors.msu_id = "MSU ID is required";
    if (!profileForm.age) errors.age = "Age is required";
    if (!profileForm.gender) errors.gender = "Gender is required";
    if (!profileForm.move_in_date) errors.move_in_date = "Date is required";
    if (!profileForm.bio) errors.bio = "Bio is required";
    if (!profileForm.majors) errors.majors = "Majors is required";
    setProfileFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit for create/update user
  const handleUserFormSubmit = () => {
    if (!validateUserForm()) return;
    const { msu_email, password, role, id } = userForm;
    // For update, if password is blank, do not include it.
    let userData = { msu_email, role };
    if (!isEditMode || (isEditMode && password)) {
      userData.password = password;
    }

    console.log("User Data:", userData);

    const thunk = isEditMode
      ? updateUser({ userId: id, userData })
      : registerUser(userData);
    dispatch(thunk)
      .unwrap()
      .then(() => {
        refreshData();
        setDialogOpen(false);
      })
      .catch((e) => console.error("Save user failed:", e));
  };

  // Submit for updating profile
  const handleProfileFormSubmit = () => {
    if (!validateProfileForm()) return;
    const fd = new FormData();
    ["first_name", "last_name", "msu_id"].forEach((k) =>
      fd.append(k, profileForm[k] || "")
    );

    ["age", "gender", "move_in_date", "bio", "majors"].forEach((key) =>
      fd.append(key, profileForm[key] || "")
    );

   const cleanDate = profileForm.move_in_date? profileForm.move_in_date.split("T")[0] : "";
   fd.append("move_in_date", cleanDate);

    if (profileImageFile) fd.append("profile_image", profileImageFile);
    dispatch(
      updateUserProfile({ userId: profileForm.user_id, profileData: fd })
    )
      .unwrap()
      .then((data) => {
        refreshData();
        // Update preview with new image URL from backend, if returned.
        setProfileImagePreview(data.profile_image || null);
        setDialogOpen(false);
        setProfileImageFile(null);
      })
      .catch((e) => console.error("Save profile failed:", e));
  };

  const isLoading = authStatus === "loading" || profileStatus === "loading";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeaders title="Users" subtitle="Manage users & profiles" />

        <AdminTableController
          title="User Management"
          searchPlaceholder="Search by name or email..."
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onCategoryChange={setRoleFilter}
          categoryOptions={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
          statusOptions={[]}
          onAddClick={handleAdd}
        />

        <AdminTable
          data={displayUsers}
          columns={[
            { field: "id", headerName: "ID" },
            {
              field: "profile_image",
              headerName: "Avatar",
              render: (v) => (
                <Avatar src={getImageUrl(v)} sx={{ width: 40, height: 40 }} />
              ),
            },
            { field: "first_name", headerName: "First Name" },
            { field: "last_name", headerName: "Last Name" },
            {
              field: "msu_email",
              headerName: "Email",
              render: (v) => <EmailCell value={v} />,
            },
            { field: "msu_id", headerName: "MSU ID" },
            {
              field: "created_at",
              headerName: "Created",
              render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
            },
            {
              field: "role",
              headerName: "Role",
              render: (v) => (
                <Button size="small" variant="contained">
                  {v}
                </Button>
              ),
            },
          ]}
          onRowAction={handleRowAction}
          menuActions={menuActionsList}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          count={totalUsers}
          loading={isLoading}
        />
      </Box>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen && activeTab === "users"}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="msu_email"
                label="MSU Email"
                fullWidth
                value={userForm.msu_email}
                onChange={(e) =>
                  setUserForm({ ...userForm, msu_email: e.target.value })
                }
                error={Boolean(userFormErrors.msu_email)}
                helperText={userFormErrors.msu_email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label={
                  isEditMode
                    ? "New Password (leave blank to keep current)"
                    : "Password"
                }
                type="password"
                fullWidth
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                error={Boolean(userFormErrors.password)}
                helperText={userFormErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="role"
                label="Role"
                select
                fullWidth
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                error={Boolean(userFormErrors.role)}
                helperText={userFormErrors.role}
                SelectProps={{ native: true }}
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUserFormSubmit} color="primary">
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog
        open={dialogOpen && activeTab === "profiles"}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                src={getImageUrl(
                  profileImagePreview ||
                    profileForm.profile_image ||
                    "/default-avatar.png"
                )}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="upload-profile"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfileImageFile(file);
                  if (file) {
                    setProfileImagePreview(URL.createObjectURL(file));
                  } else {
                    setProfileImagePreview(null);
                  }
                }}
                style={{ display: "none" }}
              />
              <label htmlFor="upload-profile">
                <Button fullWidth variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={profileForm.first_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, first_name: e.target.value })
                }
                error={Boolean(profileFormErrors.first_name)}
                helperText={profileFormErrors.first_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={profileForm.last_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, last_name: e.target.value })
                }
                error={Boolean(profileFormErrors.last_name)}
                helperText={profileFormErrors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="msu_id"
                label="MSU ID"
                fullWidth
                value={profileForm.msu_id}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, msu_id: e.target.value })
                }
                error={Boolean(profileFormErrors.msu_id)}
                helperText={profileFormErrors.msu_id}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="msu_email"
                label="Email"
                fullWidth
                value={profileForm.msu_email}
                disabled
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="age"
                label="Age"
                type="number"
                fullWidth
                value={profileForm.age || ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, age: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="gender"
                label="Gender"
                fullWidth
                value={profileForm.gender || ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, gender: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="move_in_date"
                label="Move In Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                // If the move_in_date is an ISO string, show only the date part.
                value={
                  profileForm.move_in_date
                    ? profileForm.move_in_date.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    move_in_date: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Bio"
                multiline
                rows={3}
                fullWidth
                value={profileForm.bio || ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="majors"
                label="Majors"
                fullWidth
                value={profileForm.majors || ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, majors: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
