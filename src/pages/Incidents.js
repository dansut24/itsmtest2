// src/pages/Incidents.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const dummyIncidents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Incident ${i + 1}`,
  description: `Description for incident ${i + 1}`,
  status: ["Open", "Closed", "Pending"][i % 3],
}));

const Incidents = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleRaiseIncident = () => {
    setAnchorEl(null);
    window.open("/raise-incident", "_blank");
  };

  const handleExport = (type) => {
    setAnchorEl(null);
    console.log(`Exporting to ${type}`);
    // Hook up actual export logic here
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Incidents</Typography>
        <IconButton onClick={handleDropdownClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
        >
          <MenuItem onClick={handleRaiseIncident}>Raise Incident</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleExport("csv")}>Export as CSV</MenuItem>
          <MenuItem onClick={() => handleExport("xlsx")}>Export as Excel</MenuItem>
          <MenuItem onClick={() => handleExport("pdf")}>Export as PDF</MenuItem>
        </Menu>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {dummyIncidents.map((incident) => (
          <Card key={incident.id}>
            <CardContent>
              <Typography variant="h6">{incident.title}</Typography>
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
