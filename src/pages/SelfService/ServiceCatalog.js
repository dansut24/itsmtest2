// src/pages/SelfService/ServiceCatalog.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialCatalog = [
  {
    id: "item-1",
    title: "Laptop Request",
    description: "Request a standard business laptop.",
    image: "https://cdn-icons-png.flaticon.com/512/1792/1792523.png",
    price: 1200,
  },
  {
    id: "item-2",
    title: "Monitor",
    description: "Request a 24-inch HD monitor.",
    image: "https://cdn-icons-png.flaticon.com/512/1063/1063228.png",
    price: 250,
  },
  {
    id: "item-3",
    title: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    image: "https://cdn-icons-png.flaticon.com/512/3429/3429844.png",
    price: 320,
  },
  {
    id: "item-4",
    title: "Onboarding Setup",
    description: "Full new hire IT setup.",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    price: 0,
  },
];

const ServiceCatalog = () => {
  const [catalogItems] = useState(initialCatalog);
  const [requests, setRequests] = useState({
    request1: [],
    request2: [],
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const item = catalogItems.find((i) => i.id === result.draggableId);
    const updatedRequests = { ...requests };

    // Clone and push the item to the destination request box
    if (destination.droppableId.startsWith("request")) {
      updatedRequests[destination.droppableId] = [
        ...updatedRequests[destination.droppableId],
        { ...item, instanceId: `${item.id}-${Date.now()}` },
      ];
      setRequests(updatedRequests);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Service Catalog
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Drag and drop items below to create service requests.
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="catalog" isDropDisabled>
          {(provided) => (
            <Grid
              container
              spacing={2}
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ mb: 4 }}
            >
              {catalogItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardContent>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{ height: 64, mb: 1 }}
                          />
                          <Typography variant="h6">{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.price > 0 ? `£${item.price}` : "No cost"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>

        <Grid container spacing={2}>
          {Object.keys(requests).map((key, index) => (
            <Grid item xs={12} md={6} key={key}>
              <Droppable droppableId={key}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      border: "2px dashed #ccc",
                      minHeight: 200,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Request #{index + 1}
                    </Typography>
                    {requests[key].length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 6 }}
                      >
                        Drag items here
                      </Typography>
                    )}
                    {requests[key].map((item, idx) => (
                      <Card key={item.instanceId} sx={{ mb: 1 }}>
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.title}
                              sx={{ height: 32 }}
                            />
                            <Box>
                              <Typography>{item.title}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.price > 0 ? `£${item.price}` : "No cost"}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalog;
