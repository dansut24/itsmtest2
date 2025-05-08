// src/pages/SelfService/ServiceCatalog.js
import React, { useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Paper, TextField, Divider
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const catalogItems = [
  { id: "item-1", title: "Onboarding Request", fields: ["Full Name", "Start Date"] },
  { id: "item-2", title: "Software Installation", fields: ["Software Name", "Version"] },
  { id: "item-3", title: "Hardware Upgrade", fields: ["Device Type", "Upgrade Reason"] },
];

const ServiceCatalog = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const draggedItem = catalogItems.find((i) => i.id === result.draggableId);
    if (!selectedItems.some((i) => i.id === draggedItem.id)) {
      setSelectedItems([...selectedItems, { ...draggedItem, values: {} }]);
    }
  };

  const handleInputChange = (itemId, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, values: { ...item.values, [field]: value } }
          : item
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Service Request Catalog</Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Available Items</Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="catalog">
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
                            <Typography>{item.title}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Selected Items</Typography>
          {selectedItems.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Drag items here to configure your request.
            </Typography>
          )}
          {selectedItems.map((item) => (
            <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
              <Typography fontWeight={600} mb={1}>{item.title}</Typography>
              {item.fields.map((field) => (
                <TextField
                  key={field}
                  label={field}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                  value={item.values[field] || ""}
                  onChange={(e) => handleInputChange(item.id, field, e.target.value)}
                />
              ))}
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceCatalog;
