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
  Button,
  Stack,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const catalogItems = [
  { id: "item-1", title: "Onboarding Request", fields: ["Full Name", "Start Date"] },
  { id: "item-2", title: "Software Installation", fields: ["Software Name", "Version"] },
  { id: "item-3", title: "Hardware Upgrade", fields: ["Device Type", "Upgrade Reason"] },
];

const ServiceCatalog = () => {
  const [requests, setRequests] = useState([
    { id: uuidv4(), instances: [] }
  ]);

  const handleAddRequest = () => {
    setRequests((prev) => [...prev, { id: uuidv4(), instances: [] }]);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const targetRequestId = destination.droppableId;
    const catalogItem = catalogItems.find((item) => item.id === draggableId);
    const newInstance = {
      id: uuidv4(),
      title: catalogItem.title,
      fields: catalogItem.fields,
      values: {},
    };

    setRequests((prev) =>
      prev.map((req) =>
        req.id === targetRequestId
          ? { ...req, instances: [...req.instances, newInstance] }
          : req
      )
    );
  };

  const handleInputChange = (reqId, instId, field, value) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === reqId
          ? {
              ...req,
              instances: req.instances.map((inst) =>
                inst.id === instId
                  ? { ...inst, values: { ...inst.values, [field]: value } }
                  : inst
              ),
            }
          : req
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
          <Grid item xs={12} md={4}>
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

          {/* Request Zones */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Your Requests
            </Typography>

            <Stack spacing={3}>
              {requests.map((req) => (
                <Droppable key={req.id} droppableId={req.id}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        p: 2,
                        border: "2px dashed",
                        borderColor: snapshot.isDraggingOver ? "primary.main" : "divider",
                        bgcolor: snapshot.isDraggingOver ? "primary.light" : "background.paper",
                        minHeight: 200,
                        transition: "background-color 0.3s",
                      }}
                    >
                      {req.instances.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Drag catalog items here to build a request.
                        </Typography>
                      ) : (
                        req.instances.map((inst, idx) => (
                          <Paper key={inst.id} sx={{ p: 2, mb: 2 }}>
                            <Typography fontWeight={600} gutterBottom>
                              {inst.title} #{idx + 1}
                            </Typography>
                            {inst.fields.map((field) => (
                              <TextField
                                key={field}
                                label={field}
                                fullWidth
                                size="small"
                                margin="dense"
                                value={inst.values[field] || ""}
                                onChange={(e) =>
                                  handleInputChange(req.id, inst.id, field, e.target.value)
                                }
                              />
                            ))}
                          </Paper>
                        ))
                      )}
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              ))}

              <Button variant="outlined" onClick={handleAddRequest}>
                + Add Another Request
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalog;
