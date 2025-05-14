import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Button,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const catalogueData = [
  { id: "1", name: "Laptop Request", category: "Hardware", price: "£1,200", image: "https://cdn-icons-png.flaticon.com/512/1063/1063191.png" },
  { id: "2", name: "New Software Installation", category: "Software", price: "£100", image: "https://cdn-icons-png.flaticon.com/512/906/906175.png" },
  { id: "3", name: "VPN Access", category: "Access", price: "£0", image: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png" },
  { id: "4", name: "Onboarding Request", category: "HR", price: "£500", image: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png" },
];

const ServiceCatalogue = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.droppableId === "selected") {
      const item = catalogueData.find((i) => i.id === result.draggableId);
      if (item) {
        setSelectedItems((prev) => [...prev, { ...item, instanceId: `${item.id}-${Date.now()}` }]);
        window.history.pushState({}, "", `?request=${item.id}`);
      }
    }
  };

  const handleRemoveItem = (instanceId) => {
    setSelectedItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
  };

  return (
    <Box sx={{ p: 3, height: "100vh", boxSizing: "border-box" }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Service Catalogue
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2} sx={{ height: 'calc(100% - 100px)' }}>
          {/* Left: Catalogue */}
          <Grid item xs={12} md={6} sx={{ overflowY: "auto" }}>
            <Droppable droppableId="catalogue" isDropDisabled={true}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  <Grid container spacing={2}>
                    {catalogueData.map((item, index) => (
                      <Grid item xs={12} key={item.id}>
                        <Draggable draggableId={item.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ height: "100%" }}
                            >
                              <CardActionArea sx={{ textAlign: "center", p: 2 }}>
                                <img src={item.image} alt={item.name} style={{ height: 80 }} />
                                <CardContent>
                                  <Typography variant="h6">{item.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Category: {item.category}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Cost: {item.price}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          )}
                        </Draggable>
                      </Grid>
                    ))}
                  </Grid>
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>

          {/* Right: Selected requests */}
          <Grid item xs={12} md={6} sx={{ overflowY: "auto" }}>
            <Droppable droppableId="selected">
              {(provided) => (
                <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ p: 2, minHeight: "100%", border: "2px dashed #ccc", bgcolor: "#f9f9f9" }}>
                  <Typography variant="h6" mb={2}>
                    Selected Requests
                  </Typography>
                  {selectedItems.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Drag items here to add to your request.
                    </Typography>
                  )}
                  {selectedItems.map((item) => (
                    <Chip
                      key={item.instanceId}
                      label={`${item.name} (${item.price})`}
                      onDelete={() => handleRemoveItem(item.instanceId)}
                      sx={{ mb: 1, mr: 1 }}
                    />
                  ))}
                  {provided.placeholder}
                  {selectedItems.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6">
                        Estimated Total: {selectedItems.reduce((total, item) => {
                          const price = parseFloat(item.price.replace("£", "")) || 0;
                          return total + price;
                        }, 0).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Proceed to Checkout
                      </Button>
                    </>
                  )}
                </Paper>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default ServiceCatalogue;
