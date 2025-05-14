// src/pages/SelfService/Checkout.js

import React from "react";
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const handleConfirm = () => {
    navigate("/self-service/checkout-confirmation");
  };

  if (selectedItems.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Checkout</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You have no items in your request. Please go back to the catalogue to add items.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Review Your Request
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Please review your selected services below and confirm your submission.
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <List>
            {selectedItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={item.title}
                    secondary={`Category: ${item.category} | Estimated Price: £${item.price}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Button variant="contained" colour="primary" sx={{ mt: 3 }} onClick={handleConfirm}>
        Confirm and Submit Request
      </Button>
    </Box>
  );
};

export default Checkout;
