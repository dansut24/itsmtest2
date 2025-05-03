import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Grid,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";

const sampleIncidents = [
  { id: 1, title: "Email not working", description: "User cannot send or receive emails.", status: "Open" },
  { id: 2, title: "Printer offline", description: "Printer in room 204 shows offline.", status: "In Progress" },
  { id: 3, title: "VPN issues", description: "Connection drops intermittently.", status: "Resolved" },
  { id: 4, title: "Software install", description: "Need Adobe Acrobat Pro.", status: "Open" },
];

const Incidents = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredIncidents = sampleIncidents.filter((incident) => {
    const matchStatus = statusFilter === "All" || incident.status === statusFilter;
    const matchSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Incident List
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {filteredIncidents.map((incident) => (
        <Card
          key={incident.id}
          variant="outlined"
          sx={{
            mb: 2,
            transition: "all 0.3s ease",
            ":hover": { boxShadow: 2 },
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1">{incident.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Status: {incident.status}
                </Typography>
              </Box>
              <IconButton onClick={() => handleToggle(incident.id)} size="small">
                {expandedId === incident.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expandedId === incident.id} timeout="auto" unmountOnExit>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  {incident.description}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {filteredIncidents.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No incidents found.
        </Typography>
      )}
    </Box>
  );
};

export default Incidents;
