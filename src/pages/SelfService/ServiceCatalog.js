// src/pages/SelfService/ServiceCatalog.js

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from "@mui/material";

const serviceCatalog = {
  Access: [
    {
      id: "access-1",
      name: "VPN Access",
      description: "Secure remote access to corporate network.",
      price: "$5/mo",
      image: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    },
    {
      id: "access-2",
      name: "SharePoint Access",
      description: "Team collaboration site access.",
      price: "Free",
      image: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
    },
  ],
  Software: [
    {
      id: "software-1",
      name: "Adobe Photoshop",
      description: "Advanced photo editing software.",
      price: "$20/mo",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968520.png",
    },
    {
      id: "software-2",
      name: "Microsoft Office 365",
      description: "Word, Excel, PowerPoint, Outlook.",
      price: "$15/mo",
      image: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
    },
  ],
  Hardware: [
    {
      id: "hardware-1",
      name: "Dell Latitude Laptop",
      description: "Business-class laptop for remote/hybrid work.",
      price: "$1200",
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    },
    {
      id: "hardware-2",
      name: "Monitor (24 inch)",
      description: "Full HD LED monitor for your workspace.",
      price: "$150",
      image: "https://cdn-icons-png.flaticon.com/512/2909/2909765.png",
    },
  ],
};

const ServiceCatalog = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Service Catalog
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Browse available services and products by category.
      </Typography>

      {Object.entries(serviceCatalog).map(([category, items]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardActionArea>
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ height: 64, marginBottom: 12 }}
                      />
                      <Typography variant="subtitle1" fontWeight={500}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      <Chip label={item.price} color="primary" variant="outlined" />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ServiceCatalog;
