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
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

// Generate 100 dummy incidents
const allIncidents = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Incident #${i + 1}: ${[
    "Login issue",
    "Network failure",
    "VPN disconnect",
    "Email delay",
    "Access denied",
    "Printer jam",
    "App crash",
    "Update stuck",
    "Power loss",
    "Missing files",
  ][i % 10]}`,
  description: [
    "User unable to authenticate on domain.",
    "Connection drops intermittently.",
    "VPN client fails to initialize.",
    "Emails delayed by more than 10 minutes.",
    "User cannot access shared folders.",
    "Print job stuck in queue.",
    "Application closes unexpectedly.",
    "System update fails to complete.",
    "Unexpected shutdown during work hours.",
    "User reports lost documents after reboot.",
  ][i % 10],
}));

const ITEMS_PER_PAGE = 50;

const Incidents = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = allIncidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          position: "sticky",
          top: 92, // Adjust based on Navbar + AppsBar height
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          placeholder="Search incidents..."
          size="small"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 on search
          }}
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, py: 2 }}>
        {paginated.map((incident) => (
          <Card key={incident.id} sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h6">{incident.title}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">{incident.description}</Typography>
            </CardContent>
          </Card>
        ))}

        {filtered.length > ITEMS_PER_PAGE && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Incidents;
