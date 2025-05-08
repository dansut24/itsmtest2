import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const services = [
  { id: "1", name: "New Laptop", description: "Request a new laptop for work." },
  { id: "2", name: "Software Installation", description: "Install licensed software on your device." },
  { id: "3", name: "Access Request", description: "Request access to shared drives or applications." },
  { id: "4", name: "Phone Setup", description: "Setup and configure a new mobile or desk phone." },
];

const ServiceCatalog = () => {
  const [requestItems, setRequestItems] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const draggedItem = services.find((item) => item.id === result.draggableId);
    if (!requestItems.some((item) => item.id === draggedItem.id)) {
      setRequestItems([...requestItems, draggedItem]);
    }
  };

  const handleRemove = (id) => {
    setRequestItems(requestItems.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Service Request Catalog
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Available Services
            </Typography>
            <Droppable droppableId="services" isDropDisabled={true}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {services.map((service, index) => (
                    <Draggable
                      key={service.id}
                      draggableId={service.id}
                      index={index}
                    >
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 2, cursor: "grab" }}
                        >
                          <Typography fontWeight={600}>
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {service.description}
                          </Typography>
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
            <Typography variant="subtitle1" gutterBottom>
              Selected for Request
            </Typography>
            <Droppable droppableId="request">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 200,
                    p: 2,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                  }}
                >
                  {requestItems.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Drag items here to include in your request.
                    </Typography>
                  )}
                  {requestItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 2, position: "relative" }}
                        >
                          <Typography fontWeight={600}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          <Chip
                            label="Remove"
                            onClick={() => handleRemove(item.id)}
                            size="small"
                            color="error"
                            sx={{ position: "absolute", top: 8, right: 8 }}
                          />
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>

      {requestItems.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Button variant="contained" color="primary">
            Submit Request
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ServiceCatalog;
