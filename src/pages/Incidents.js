import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {
  exportToCSV,
  exportToXLSX,
  exportToPDF
} from "../utils/exportUtils";
import ExportPreviewModal from "../components/ExportPreviewModal";

const testIncidents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Incident ${i + 1}`,
  description: `This is a sample description for incident number ${i + 1}.`,
  status: ["Open", "In Progress", "Resolved"][i % 3]
}));

const Incidents = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportType, setExportType] = useState("csv");
  const [exportTitle, setExportTitle] = useState("Incident Report");

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuAction = (type) => {
    if (type === "new") {
      // Handle new incident navigation here
      alert("Redirect to create new incident...");
    } else {
      setExportType(type);
      setExportTitle("Incident Report");
      setPreviewOpen(true);
    }
    handleMenuClose();
  };

  const handleExportConfirm = () => {
    if (exportType === "csv") exportToCSV(testIncidents, exportTitle);
    if (exportType === "xlsx") exportToXLSX(testIncidents, exportTitle);
    if (exportType === "pdf") exportToPDF(testIncidents, exportTitle);
    setPreviewOpen(false);
  };

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          placeholder="Search incidents..."
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, mr: 2 }}
        />

        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuAction("new")}>New Incident</MenuItem>
          <MenuItem onClick={() => handleMenuAction("csv")}>Export to CSV</MenuItem>
          <MenuItem onClick={() => handleMenuAction("xlsx")}>Export to Excel</MenuItem>
          <MenuItem onClick={() => handleMenuAction("pdf")}>Export to PDF</MenuItem>
        </Menu>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, py: 2 }}>
        {testIncidents.map((incident) => (
          <Card key={incident.id} sx={{ width: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">{incident.title}</Typography>
                <Box
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    px: 1,
                    borderRadius: 1,
                    fontSize: 12,
                  }}
                >
                  {incident.status}
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">{incident.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <ExportPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleExportConfirm}
        exportTitle={exportTitle}
        setExportTitle={setExportTitle}
        exportType={exportType}
        recordCount={testIncidents.length}
      />
    </Box>
  );
};

export default Incidents;
