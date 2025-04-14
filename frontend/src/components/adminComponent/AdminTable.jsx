import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getStatusColor } from "../../utils/colorUtils";

const AdminTable = ({
  data,
  columns,
  onRowAction,
  menuActions,
  showStatus = false,
  showImage = false,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  count,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionRowId, setActionRowId] = React.useState(null);

  // If using server-side pagination, the data is already limited.
  const currentPageData = data; // No slicing here

  const getRowKey = (row) => row.id || row.room_number;

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setActionRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionRowId(null);
  };

  const handleActionClick = (action, id) => {
    if (onRowAction) onRowAction(action.toLowerCase(), id);
    handleMenuClose();
  };
  return (
    <Paper sx={{ marginTop: 2, borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {showImage && <TableCell sx={{ backgroundColor: "white" }}>Image</TableCell>}

              {/* Render column headers dynamically */}
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ backgroundColor: "white" }}>{column.headerName}</TableCell>
              ))}

              {/* Show Status column if enabled */}
              {showStatus && <TableCell sx={{ backgroundColor: "white" }}>Status</TableCell>}
              <TableCell sx={{ backgroundColor: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row) => {
              const rowKey = getRowKey(row);
              return (
                <TableRow key={rowKey}>
                  {showImage && (
                    <TableCell>
                      <Avatar src={row.image} alt={row.title || row.name} />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={`${rowKey}-${column.field}`}>
                      {column.render
                        ? column.render(row[column.field], row)
                        : row[column.field] ?? "—"}
                    </TableCell>
                  ))}
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
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, rowKey)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && actionRowId === rowKey}
                      onClose={handleMenuClose}
                    >
                      {menuActions.map((action) => (
                        <MenuItem key={action} onClick={() => handleActionClick(action, rowKey)}>
                          {action}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default AdminTable;

