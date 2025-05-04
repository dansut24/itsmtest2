// src/pages/NotFound.js

import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 92px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        animation: "fadeIn 0.8s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Illustration */}
      <Box
        component="img"
        src="/illustrations/404.svg"
        alt="Not found"
        sx={{ width: "100%", maxWidth: 320, mb: 3 }}
      />

      <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
        We couldn’t find the page you were looking for.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
