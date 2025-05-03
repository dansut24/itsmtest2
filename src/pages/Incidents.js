
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Divider, TextField,
  InputAdornment, IconButton, Button, Menu, MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import {
  exportToCSV,
  exportToXLSX,
  exportToPDF,
} from "../utils/exportUtils";

const generateIncidents = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Incident ${i + 1}`,
    description: `This is a description for incident #${i + 1}`,
    status: ["Open", "In Progress", "Resolved"][i % 3],
  }));
};

const Incidents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [incidents] = useState(generateIncidents());

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const filteredIncidents = incidents.filter(
    (i) =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleMenuOpen}
          >
            New Incident
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Create Manually</MenuItem>
            <MenuItem onClick={handleMenuClose}>From Template</MenuItem>
          </Menu>
        </Box>

        <TextField
          placeholder="Search incidents..."
          size="small"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 300 }}
        />

        <Box display="flex" gap={1}>
          <Button size="small" variant="outlined" onClick={() => exportToCSV(filteredIncidents)}>CSV</Button>
          <Button size="small" variant="outlined" onClick={() => exportToXLSX(filteredIncidents)}>XLSX</Button>
          <Button size="small" variant="outlined" onClick={() => exportToPDF(filteredIncidents)}>PDF</Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, py: 2 }}>
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h6">{incident.title}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">{incident.description}</Typography>
              <Box
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "primary.light",
                  color: "white",
                  display: "inline-block",
                  fontSize: "0.75rem",
                }}
              >
                {incident.status}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Incidents;
