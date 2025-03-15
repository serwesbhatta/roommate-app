import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Checkbox,
  Button,
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";

// Sample data (replace with API data)
const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i % 10}.jpg`,
  title: `User ${i + 1}`,
  date: "January 1, 2024",
  phone: `555-010${i}`,
  amount: `$${(Math.random() * 100).toFixed(2)}`,
  status: "Danger",
}));

const AdminTable = ({ data = sampleData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionRowId, setActionRowId] = useState(null);

  // Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle row selection
  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all rows
  const handleSelectAll = (event) => {
    setSelected(event.target.checked ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id) : []);
  };

  // Open action menu
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setActionRowId(id);
  };

  // Close action menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionRowId(null);
  };

  return (
    <Paper sx={{ marginTop: 2, borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
      {/* Bulk Action Toolbar (Visible when rows are selected) */}
      {selected.length > 0 && (
        <Toolbar sx={{ bgcolor: "#f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">{selected.length} selected</Typography>
          <div>
            <Button startIcon={<DeleteIcon />} color="error" onClick={() => console.log("Delete selected", selected)}>
              Delete
            </Button>
            <Button startIcon={<BlockIcon />} color="warning" onClick={() => console.log("Block selected", selected)}>
              Block
            </Button>
          </div>
        </Toolbar>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rowsPerPage}
                  checked={selected.length === rowsPerPage}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} selected={selected.includes(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                </TableCell>
                <TableCell>
                  <Avatar src={row.image} alt={row.title} />
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" size="small">
                    {row.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  {/* Action Menu */}
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && actionRowId === row.id} onClose={handleMenuClose}>
                    <MenuItem onClick={() => console.log("View", row.id)}>View</MenuItem>
                    <MenuItem onClick={() => console.log("Edit", row.id)}>Edit</MenuItem>
                    <MenuItem onClick={() => console.log("Block", row.id)}>Block</MenuItem>
                    <MenuItem onClick={() => console.log("Delete", row.id)}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdminTable;
