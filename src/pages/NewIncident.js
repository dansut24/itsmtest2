import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";

const steps = ["Search Customer", "Enter Details", "Submit"];

const NewIncident = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState("");
  const [details, setDetails] = useState({ title: "", description: "" });

  const handleSearch = () => {
    if (customer.trim()) {
      setActiveStep(1);
    }
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Submit logic goes here
    setActiveStep(2);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Raise New Incident
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            Search for a customer:
          </Typography>
          <TextField
            fullWidth
            label="Customer Name or ID"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleSearch}>
              Continue
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" gutterBottom>
            Enter incident details:
          </Typography>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={details.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={details.description}
            onChange={handleChange}
          />
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Incident submitted successfully!
          </Typography>
          <Typography variant="body2">You may return to the incidents list.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default NewIncident;
