// src/pages/SelfService/ServiceCatalog.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
      description: "Productivity suite: Word, Excel, etc.",
      price: "$15/mo",
      image: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
    },
  ],
  Hardware: [
    {
      id: "hardware-1",
      name: "Dell Latitude Laptop",
      description: "Business-class laptop for remote work.",
      price: "$1200",
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    },
    {
      id: "hardware-2",
      name: "24-inch Monitor",
      description: "Full HD display for productivity.",
      price: "$150",
      image: "https://cdn-icons-png.flaticon.com/512/2909/2909765.png",
    },
  ],
};

const ServiceCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requests, setRequests] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId !== "request") return;

    const draggedItem = serviceCatalog[selectedCategory].find(item => item.id === draggableId);
    if (draggedItem) {
      setRequests(prev => [...prev, { ...draggedItem, uid: `${draggedItem.id}-${Date.now()}` }]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Service Catalog
      </Typography>

      {!selectedCategory ? (
        <>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Select a category to explore available services.
          </Typography>
          <Grid container spacing={3}>
            {Object.keys(serviceCatalog).map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card>
                  <CardActionArea onClick={() => setSelectedCategory(category)}>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="h6" fontWeight={500}>
                        {category}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {selectedCategory} Services
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Droppable droppableId="catalog" isDropDisabled>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                  >
                    {serviceCatalog[selectedCategory].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ width: 200, p: 1 }}
                          >
                            <Box textAlign="center">
                              <Avatar src={item.image} alt={item.name} sx={{ mx: "auto", width: 48, height: 48, mb: 1 }} />
                              <Typography fontWeight={600}>{item.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                              <Chip label={item.price} size="small" sx={{ mt: 1 }} />
                            </Box>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Your Request
              </Typography>
              <Droppable droppableId="request">
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 300, p: 2, bgcolor: "grey.100" }}
                  >
                    {requests.map((item, index) => (
                      <Box
                        key={item.uid}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          gap: 1,
                          bgcolor: "white",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Avatar src={item.image} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography fontWeight={500}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.price}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Grid>
          </Grid>
        </DragDropContext>
      )}
    </Box>
  );
};

export default ServiceCatalog;
