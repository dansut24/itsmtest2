import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  Collapse,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const mockIncidents = [
  { id: 1, title: "Email not syncing", status: "Open", details: "User cannot sync Outlook with Exchange server." },
  { id: 2, title: "Laptop overheating", status: "In Progress", details: "Device overheats during video calls." },
  { id: 3, title: "VPN issues", status: "Resolved", details: "User reports being unable to connect remotely." },
];

const Incidents = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const handleExpandClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredIncidents = mockIncidents.filter(
    (incident) =>
      (filter === "All" || incident.status === filter) &&
      incident.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f5f5f5", px: 2, borderRadius: 1 }}>
          <SearchIcon />
          <InputBase
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 1 }}
          />
        </Box>

        <Select value={filter} onChange={(e) => setFilter(e.target.value)} size="small">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2}>
        {filteredIncidents.map((incident) => (
          <Grid item xs={12} key={incident.id}>
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card elevation={2}>
                <CardHeader
                  title={incident.title}
                  subheader={`Status: ${incident.status}`}
                  action={
                    <ExpandMore
                      expand={expandedId === incident.id}
                      onClick={() => handleExpandClick(incident.id)}
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  }
                />
                <Collapse in={expandedId === incident.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography>{incident.details}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Incidents;
