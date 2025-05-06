// src/pages/SelfService/SelfService.js

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";

const options = [
  {
    title: "Knowledge Base",
    icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
    path: "/knowledge-base",
    description: "Search help articles and FAQs.",
  },
  {
    title: "New Request",
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    path: "/new-incident",
    description: "Raise a new service or support request.",
  },
  {
    title: "My Requests",
    icon: <ListAltIcon sx={{ fontSize: 40 }} />,
    path: "/incidents",
    description: "View your existing incidents and requests.",
  },
];

const SelfService = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Self Service Portal
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Access knowledge and manage your IT support needs easily.
      </Typography>

      <Grid container spacing={3}>
        {options.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.title}>
            <Card>
              <CardActionArea
                onClick={() => navigate(option.path)}
                sx={{ p: 2, textAlign: "center" }}
              >
                {option.icon}
                <CardContent>
                  <Typography variant="h6" fontWeight={500}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SelfService;
