import React, { useState, useEffect } from "react";
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
import { getStatusColor } from "../../utils/colorUtils";


const AdminTable = ({ 
  data, 
  columns, 
  onRowAction, 
  menuActions, 
  showStatus = false,
  showImage = false,
  onBulkAction = () => {},  // Callback for bulk actions (default is an empty function)
  bulkActions = [           // Default bulk actions (Delete & Block)
    { label: "Delete", icon: <DeleteIcon />, color: "error", action: "delete" },
    { label: "Block", icon: <BlockIcon />, color: "warning", action: "block" }
  ]
}) => {

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for selected rows (for bulk actions)
  const [selected, setSelected] = useState([]);

  // State for menu (for row actions)
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionRowId, setActionRowId] = useState(null);

  // State to track if current page has more than 5 rows
  const [needsScroll, setNeedsScroll] = useState(false);
  
  // Calculate current page data
  const currentPageData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Check if we need scrolling
  useEffect(() => {
    setNeedsScroll(currentPageData.length > 5);
  }, [currentPageData.length]);

  // Handle pagination change
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle row selection (add/remove from selected array)
  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all rows in the current page
  const handleSelectAll = (event) => {
    setSelected(event.target.checked 
      ? currentPageData.map((row) => row.id) 
      : []);
  };

  // Open the action menu for a specific row
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setActionRowId(id);
  };

  // Close action menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionRowId(null);
  };

  // Handle clicking a menu action (e.g., Delete, Block)
  const handleActionClick = (action, id) => {
    if (onRowAction) {
      onRowAction(action.toLowerCase(), id);
    }
    handleMenuClose();
  };

  // Handle bulk actions (Delete, Block)
  const handleBulkAction = (action) => {
    if (onBulkAction) {
      onBulkAction(action, selected);
    }
    setSelected([]);
  };

  return (
    <Paper sx={{ marginTop: 2, borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>

      {/* Bulk Action Toolbar (Visible when rows are selected) */}
      {selected.length > 0 && (
        <Toolbar sx={{ bgcolor: "#f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">{selected.length} selected</Typography>
          <div>
            {bulkActions.map((action) => (
              <Button 
                key={action.action}
                startIcon={action.icon} 
                color={action.color} 
                onClick={() => handleBulkAction(action.action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Toolbar>
      )}

      <TableContainer 
        sx={{ 
          maxHeight: needsScroll ? '400px' : 'unset',
          overflowY: needsScroll ? 'auto' : 'visible'
        }}
      >
        <Table stickyHeader={needsScroll}>

          {/* Table Header */}
          <TableHead>
            <TableRow>

              {/* Checkbox for selecting all rows */}
              <TableCell padding="checkbox" sx={{ backgroundColor: "white" }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < currentPageData.length}
                  checked={currentPageData.length > 0 && selected.length === currentPageData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>

              {/* Show Image column if enabled */}
              {showImage && <TableCell sx={{ backgroundColor: "white" }}>Image</TableCell>}

              {/* Render column headers dynamically */}
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ backgroundColor: "white" }}>{column.headerName}</TableCell>
              ))}

              {/* Show Status column if enabled */}
              {showStatus && <TableCell sx={{ backgroundColor: "white" }}>Status</TableCell>}

              {/* Action column */}
              <TableCell sx={{ backgroundColor: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* body of the table displayed */}
          <TableBody>

            {/* Render rows based on pagination */}
            {currentPageData.map((row) => (
              <TableRow key={row.id} selected={selected.includes(row.id)}>

                 {/* Checkbox for selecting a row */}
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                </TableCell>
                
                {/* User Image (if enabled) */}
                {showImage && (
                  <TableCell>
                    <Avatar src={row.image} alt={row.title || row.name} />
                  </TableCell>
                )}

                {/* Render column values dynamically */}
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column.field}`}>{row[column.field]}</TableCell>
                ))}

                {/* Status of users - active, blocked, etc*/}
                {showStatus && (
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color={getStatusColor(row.status)}
                      size="small"
                    >
                      {row.status}
                    </Button>
                  </TableCell>
                )}

               {/* Action Menu and vertical dot icon  for each row of data present in column. Menu like: view, block, delete */}
                <TableCell>

                  {/* Action Menu (Three-dot icon for each row) */}
                  <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  
                  <Menu 
                    anchorEl={anchorEl} 
                    open={Boolean(anchorEl) && actionRowId === row.id} 
                    onClose={handleMenuClose}
                  >
                    {menuActions.map((action) => (
                      <MenuItem 
                        key={action} 
                        onClick={() => handleActionClick(action, row.id)}
                      >
                        {action}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - for getting next batch of data */}
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