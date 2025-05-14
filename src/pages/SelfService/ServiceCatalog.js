import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

// Sample categories and items
const categories = [
  {
    id: "hardware",
    title: "Hardware",
    description: "Laptops, accessories, and peripherals.",
    items: [
      {
        id: "laptop",
        title: "Standard Laptop",
        image: "https://cdn-icons-png.flaticon.com/512/179/179386.png",
        description: "15-inch laptop with accessories.",
        price: "£999",
      },
      {
        id: "monitor",
        title: "24-inch Monitor",
        image: "https://cdn-icons-png.flaticon.com/512/179/179386.png",
        description: "Full HD 24-inch monitor.",
        price: "£199",
      },
    ],
  },
  {
    id: "software",
    title: "Software & Access",
    description: "Software, access requests, and tools.",
    items: [
      {
        id: "office",
        title: "Microsoft Office 365",
        image: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
        description: "Full Office 365 licence.",
        price: "£99",
      },
      {
        id: "vpn",
        title: "VPN Access",
        image: "https://cdn-icons-png.flaticon.com/512/179/179386.png",
        description: "Remote secure VPN access.",
        price: "£25",
      },
    ],
  },
];

const SelfServiceCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    window.history.pushState({}, "", `/self-service/catalog/${categoryId}`);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    window.history.pushState({}, "", `/self-service/catalog`);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const item = categories
      .find((cat) => cat.id === selectedCategory)
      .items.find((itm) => itm.id === result.draggableId);
    if (item) setSelectedItems((prev) => [...prev, { ...item, uid: Date.now() }]);
  };

  const handleRemoveItem = (uid) => {
    setSelectedItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Service Catalogue
      </Typography>

      {!selectedCategory ? (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardActionArea onClick={() => handleCategoryClick(category.id)}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6">{category.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" display="inline" ml={1}>
              {categories.find((cat) => cat.id === selectedCategory)?.title}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Droppable droppableId="catalog-items" isDropDisabled>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {categories
                        .find((cat) => cat.id === selectedCategory)
                        .items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ mb: 2 }}
                              >
                                <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                  <img src={item.image} alt={item.title} width={50} />
                                  <Box flexGrow={1}>
                                    <Typography fontWeight={600}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {item.description}
                                    </Typography>
                                  </Box>
                                  <Chip label={item.price} colour="primary" />
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

              <Grid item xs={12} md={4}>
                <Droppable droppableId="request-box">
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 400,
                        border: "2px dashed #ccc",
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Your Request
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      {selectedItems.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Drag items here to build your request.
                        </Typography>
                      )}
                      {selectedItems.map((item, index) => (
                        <Card key={item.uid} sx={{ mb: 1 }}>
                          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography>{item.title}</Typography>
                            <IconButton onClick={() => handleRemoveItem(item.uid)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </CardContent>
                        </Card>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            </Grid>
          </DragDropContext>

          {selectedItems.length > 0 && (
            <Box sx={{ mt: 4, textAlign: "right" }}>
              <Button variant="contained" size="large">
                Checkout Request
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SelfServiceCatalog;
