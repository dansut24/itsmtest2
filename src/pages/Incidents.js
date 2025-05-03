// src/pages/Incidents.js

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
  Tooltip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { exportToCSV, exportToXLSX, exportToPDF } from "../utils/exportUtils";

const testIncidents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Incident ${i + 1}`,
  description: `Details about incident number ${i + 1}.`,
  status: ["Open", "In Progress", "Resolved"][i % 3],
}));

const Incidents = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownAction = (action) => {
    handleDropdownClose();
    switch (action) {
      case "new":
        navigate("/new-incident");
        break;
      case "export_csv":
        exportToCSV(testIncidents, "incidents");
        break;
      case "export_xlsx":
        exportToXLSX(testIncidents, "incidents");
        break;
      case "export_pdf":
        exportToPDF(testIncidents, "incidents");
        break;
      default:
        break;
    }
  };

  const filteredIncidents = testIncidents.filter((incident) =>
    incident.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
          position: "sticky",
          top: 92,
          zIndex: 1,
        }}
      >
        <TextField
          placeholder="Search incidents..."
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, mr: 1 }}
        />

        <Tooltip title="More actions">
          <IconButton onClick={handleDropdownClick}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
          <MenuItem onClick={() => handleDropdownAction("new")}>New Incident</MenuItem>
          <MenuItem onClick={() => handleDropdownAction("export_csv")}>Export CSV</MenuItem>
          <MenuItem onClick={() => handleDropdownAction("export_xlsx")}>Export XLSX</MenuItem>
          <MenuItem onClick={() => handleDropdownAction("export_pdf")}>Export PDF</MenuItem>
        </Menu>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, py: 2 }}>
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} sx={{ width: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{incident.title}</Typography>
                <Box
                  sx={{
                    fontSize: 12,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
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
    </Box>
  );
};

export default Incidents;
