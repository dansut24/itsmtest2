// src/pages/SelfService/ServiceCatalog.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const catalogItems = [
  { id: "item-1", name: "Laptop (Standard)" },
  { id: "item-2", name: "Monitor (24 inch)" },
  { id: "item-3", name: "VPN Access" },
  { id: "item-4", name: "Microsoft Office License" },
  { id: "item-5", name: "Email Distribution List Access" },
];

const ServiceCatalog = () => {
  const [requestItems, setRequestItems] = useState([]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId !== "request") return;

    const item = catalogItems.find((i) => i.id === draggableId);
    if (!requestItems.find((i) => i.id === item.id)) {
      setRequestItems([...requestItems, item]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2} fontWeight={600}>
        Service Request Catalog
      </Typography>
      <Typography variant="body2" mb={3} color="text.secondary">
        Drag items from the catalog into the request builder.
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Catalog Items</Typography>
            <Droppable droppableId="catalog" isDropDisabled>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
                >
                  {catalogItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, cursor: "grab" }}
                        >
                          {item.name}
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Request Builder</Typography>
            <Droppable droppableId="request">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ mt: 2, minHeight: 200, border: "1px dashed gray", p: 2 }}
                >
                  {requestItems.length === 0 ? (
                    <Typography color="text.secondary">Drop items here</Typography>
                  ) : (
                    requestItems.map((item, index) => (
                      <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                        {item.name}
                      </Paper>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            <Divider sx={{ my: 2 }} />
            <Button variant="contained" disabled={requestItems.length === 0}>
              Submit Request
            </Button>
          </Grid>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalog;
