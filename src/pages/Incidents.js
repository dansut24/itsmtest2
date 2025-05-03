import React, { useState, useEffect, useRef } from "react";
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
  Pagination,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const generateDummyIncidents = () => {
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];
  const titles = ["Printer issue", "Email down", "VPN problem", "Login failed", "Blue screen error"];
  const descriptions = [
    "Device not functioning as expected.",
    "Unable to access corporate email.",
    "Remote connection fails intermittently.",
    "User cannot log in to workstation.",
    "Unexpected system crash encountered.",
  ];

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length] + ` #${i + 1}`,
    description: descriptions[i % descriptions.length],
    status: statuses[i % statuses.length],
  }));
};

const Incidents = () => {
  const allIncidents = generateDummyIncidents();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredIncidents, setFilteredIncidents] = useState(allIncidents);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;
  const searchRef = useRef(null);

  useEffect(() => {
    let result = allIncidents;
    if (searchTerm) {
      result = result.filter((incident) =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((incident) => incident.status === statusFilter);
    }
    setFilteredIncidents(result);
    setPage(1);
  }, [searchTerm, statusFilter]);

  const paginatedIncidents = filteredIncidents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        ref={searchRef}
        sx={{
          px: 2,
         
          position: "sticky",
          
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
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
          sx={{ flex: 1 }}
        />
        <IconButton onClick={openMenu}>
          <FilterListIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={() => { setStatusFilter("All"); closeMenu(); }}>All</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("Open"); closeMenu(); }}>Open</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("In Progress"); closeMenu(); }}>In Progress</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("Resolved"); closeMenu(); }}>Resolved</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("Closed"); closeMenu(); }}>Closed</MenuItem>
        </Menu>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 2,
          py: 2,
          
          "& .slide-up": {
            animation: "slideUpFade 0.4s ease forwards",
            opacity: 0,
            transform: "translateY(10px)",
          },
          "@keyframes slideUpFade": {
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        {paginatedIncidents.map((incident) => (
          <Card key={incident.id} className="slide-up" sx={{ width: "100%", position: "relative" }}>
            <CardContent>
              <Typography variant="h6">{incident.title}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">{incident.description}</Typography>
              <Chip
                label={incident.status}
                size="small"
                sx={{ position: "absolute", top: 8, right: 8 }}
                color={
                  incident.status === "Open"
                    ? "error"
                    : incident.status === "In Progress"
                    ? "warning"
                    : incident.status === "Resolved"
                    ? "success"
                    : "default"
                }
              />
            </CardContent>
          </Card>
        ))}
        <Pagination
          count={Math.ceil(filteredIncidents.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{ alignSelf: "center", mt: 2 }}
        />
      </Box>
    </Box>
  );
};

export default Incidents;
