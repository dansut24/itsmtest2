// src/pages/SelfService/ServiceCatalog.js

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import WifiIcon from "@mui/icons-material/Wifi";
import SecurityIcon from "@mui/icons-material/Security";

const services = [
  {
    id: "onboarding",
    name: "Employee Onboarding",
    description: "Provision accounts, hardware, and workspace access.",
    icon: <PeopleIcon />,
    category: "HR",
    price: 200,
  },
  {
    id: "laptop",
    name: "New Laptop Request",
    description: "Order and configure a new device.",
    icon: <DesktopWindowsIcon />,
    category: "Hardware",
    price: 900,
  },
  {
    id: "wifi",
    name: "WiFi Access Request",
    description: "Request temporary or permanent WiFi credentials.",
    icon: <WifiIcon />,
    category: "Network",
    price: 0,
  },
  {
    id: "vpn",
    name: "VPN Setup",
    description: "Secure remote access configuration.",
    icon: <SecurityIcon />,
    category: "Network",
    price: 30,
  },
];

const categories = ["All", ...new Set(services.map((s) => s.category))];

const ServiceCatalog = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === "All" || s.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Service Catalog
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card variant="outlined">
              <CardActionArea>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{service.icon}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Chip
                        label={`£${service.price}`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceCatalog;
