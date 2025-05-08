// src/pages/SelfService/ServiceCatalog.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Divider,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const catalogItems = [
  { id: "item-1", title: "Onboarding Request", fields: ["Full Name", "Start Date"] },
  { id: "item-2", title: "Software Installation", fields: ["Software Name", "Version"] },
  { id: "item-3", title: "Hardware Upgrade", fields: ["Device Type", "Upgrade Reason"] },
];

const ServiceCatalog = () => {
  const [instances, setInstances] = useState([]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId !== "dropzone") return;

    const original = catalogItems.find((item) => item.id === draggableId);
    const newInstance = {
      id: uuidv4(), // unique for each instance
      title: original.title,
      fields: original.fields,
      values: {},
    };
    setInstances((prev) => [...prev, newInstance]);
  };

  const handleInputChange = (id, field, value) => {
    setInstances((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, values: { ...item.values, [field]: value } } : item
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Service Request Catalog
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={4}>
          {/* Catalog Items */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Available Items
            </Typography>
            <Droppable droppableId="catalog" isDropDisabled>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {catalogItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <Card
                          sx={{ mb: 2 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardContent>
                            <Typography fontWeight={500}>{item.title}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>

          {/* Drop Zone */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Your Requests
            </Typography>
            <Droppable droppableId="dropzone">
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 300,
                    p: 2,
                    backgroundColor: snapshot.isDraggingOver ? "primary.light" : "background.paper",
                    border: "2px dashed",
                    borderColor: snapshot.isDraggingOver ? "primary.main" : "divider",
                    transition: "background-color 0.3s",
                  }}
                >
                  {instances.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Drag catalog items here to build your request.
                    </Typography>
                  ) : (
                    instances.map((instance, idx) => (
                      <Paper key={instance.id} sx={{ p: 2, mb: 2 }}>
                        <Typography fontWeight={600} gutterBottom>
                          {instance.title} #{idx + 1}
                        </Typography>
                        {instance.fields.map((field) => (
                          <TextField
                            key={field}
                            label={field}
                            fullWidth
                            size="small"
                            margin="dense"
                            value={instance.values[field] || ""}
                            onChange={(e) => handleInputChange(instance.id, field, e.target.value)}
                          />
                        ))}
                      </Paper>
                    ))
                  )}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalog;
