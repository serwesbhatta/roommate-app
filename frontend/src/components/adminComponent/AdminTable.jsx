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
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionRowId, setActionRowId] = React.useState(null);

  const currentPageData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ backgroundColor: "white" }}>
                  {column.headerName}
                </TableCell>
              ))}
              {showStatus && <TableCell sx={{ backgroundColor: "white" }}>Status</TableCell>}
              <TableCell sx={{ backgroundColor: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentPageData.map((row) => (
              <TableRow key={row.id}>
                {showImage && (
                  <TableCell>
                    <Avatar src={row.image} alt={row.title || row.name} />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column.field}`}>
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
                  <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && actionRowId === row.id}
                    onClose={handleMenuClose}
                  >
                    {menuActions.map((action) => {
                      // Only show Approve/Reject if pending


                      return (
                        <MenuItem key={action} onClick={() => handleActionClick(action, row.id)}>
                          {action}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
