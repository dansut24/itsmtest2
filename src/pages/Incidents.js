import React, { useEffect, useRef, useState } from "react";
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
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const statuses = ["Open", "In Progress", "Resolved", "Pending"];

const generateDummyIncidents = () => {
  const titles = [
    "Printer not working", "Email down", "Slow internet", "Software crash", "Login failed",
    "VPN not connecting", "Missing icons", "Screen flickering", "Update error", "File access denied"
  ];
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `${titles[i % titles.length]} #${i + 1}`,
    description: `Issue details for incident number ${i + 1}.`,
    status: statuses[i % statuses.length]
  }));
};

const Incidents = () => {
  const [incidents] = useState(generateDummyIncidents());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 50;
  const topRef = useRef(null);

  const filtered = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const pageCount = Math.ceil(filtered.length / perPage);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid #ccc",
          bgcolor: "background.paper",
          position: "sticky",
          top: 92,
          zIndex: 10,
        }}
        ref={topRef}
      >
        <TextField
          placeholder="Search incidents..."
          size="small"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
        {paginated.map((incident) => (
          <Card key={incident.id} className="slide-up" sx={{ width: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="h6">{incident.title}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">{incident.description}</Typography>
              </Box>
              <Chip
                label={incident.status}
                color={
                  incident.status === "Resolved"
                    ? "success"
                    : incident.status === "In Progress"
                    ? "warning"
                    : incident.status === "Pending"
                    ? "info"
                    : "error"
                }
                size="small"
                sx={{ ml: 2, mt: 0.5 }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, val) => setPage(val)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Incidents;
