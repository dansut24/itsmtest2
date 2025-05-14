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
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CloudIcon from "@mui/icons-material/Cloud";
import SecurityIcon from "@mui/icons-material/Security";

const catalogue = {
  Access: [
    {
      id: "access-email",
      title: "Email Access",
      description: "Request access to company email services.",
      icon: <CloudIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    },
    {
      id: "access-vpn",
      title: "VPN Access",
      description: "Secure access to internal network resources.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
    },
  ],
  Hardware: [
    {
      id: "hardware-laptop",
      title: "Laptop Request",
      description: "Request a company laptop.",
      icon: <LaptopChromebookIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
    },
    {
      id: "hardware-docking",
      title: "Docking Station",
      description: "Request a docking station for your laptop.",
      icon: <WorkOutlineIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    },
  ],
};

const ServiceCatalogue = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const itemId = result.draggableId;
    const [categoryKey, itemKey] = itemId.split("|");
    const item = catalogue[categoryKey].find((i) => i.id === itemKey);

    if (item) {
      setSelectedItems((prev) => [...prev, { ...item, instanceId: `${item.id}-${Date.now()}` }]);
    }
  };

  const handleRemoveItem = (instanceId) => {
    setSelectedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Service Catalogue
      </Typography>
      <Divider sx={{ my: 2 }} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={4}>
          {Object.entries(catalogue).map(([category, items]) => (
            <Grid item xs={12} md={6} key={category}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {category}
              </Typography>
              <Droppable droppableId={`catalogue-${category}`}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 200 }}>
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={`${category}|${item.id}`} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2 }}
                          >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              {item.icon}
                              <Box>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.description}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}

          {/* Request Summary Bin */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Request Summary
            </Typography>
            <Droppable droppableId="request-bin">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 200,
                    bgcolor: "background.paper",
                    border: "2px dashed #ccc",
                    p: 2,
                    mt: 2,
                  }}
                >
                  {selectedItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Drag items here to add them to your request.
                    </Typography>
                  ) : (
                    selectedItems.map((item, index) => (
                      <Card key={item.instanceId} sx={{ mb: 2 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                          <Button size="small" onClick={() => handleRemoveItem(item.instanceId)}>
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalogue;
