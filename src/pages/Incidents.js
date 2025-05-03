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
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

const testIncidents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Incident #${i + 1}`,
  description: `This is a description of incident ${i + 1}.`,
  status: i % 2 === 0 ? "Open" : "Closed",
}));

const Incidents = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRaiseIncident = () => {
    handleMenuClose();
    alert("Launching 'Raise Incident' form...");
  };

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      {/* Actions Row */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleMenuOpen}
        >
          New Incident
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleRaiseIncident}>Raise Incident</MenuItem>
          <MenuItem onClick={handleMenuClose}>Import from CSV</MenuItem>
        </Menu>

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
          sx={{ flex: 1 }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Incident List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, py: 2 }}>
        {testIncidents.map((incident) => (
          <Card key={incident.id} sx={{ width: "100%" }}>
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
