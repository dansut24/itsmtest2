// src/pages/NewIncident.js

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

const NewIncident = () => {
  const [step, setStep] = useState(1);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCustomerSearch = () => {
    setSelectedCustomer({ name: customerQuery }); // Simulate result
    setStep(2);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Incident submitted!");
    }, 2000);
  };

  return (
    <Box sx={{ px: 2, py: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Raise New Incident
      </Typography>

      {/* Step 1: Search Customer */}
      <Paper elevation={step >= 1 ? 3 : 0} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Step 1: Search for Customer
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            label="Customer Name or Email"
            value={customerQuery}
            onChange={(e) => setCustomerQuery(e.target.value)}
          />
          <Button variant="contained" onClick={handleCustomerSearch}>
            Search
          </Button>
        </Box>
        {selectedCustomer && (
          <Typography sx={{ mt: 1 }} color="text.secondary">
            Selected: {selectedCustomer.name}
          </Typography>
        )}
      </Paper>

      {/* Step 2: Fill Incident Details */}
      {step >= 2 && (
        <Paper elevation={step >= 2 ? 3 : 0} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Step 2: Incident Details
          </Typography>
          <TextField
            fullWidth
            label="Incident Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default NewIncident;
