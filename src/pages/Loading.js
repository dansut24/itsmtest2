// src/pages/Loading.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 1500); // Delay for effect

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="background.default"
    >
      <CircularProgress />
      <Typography variant="body2" mt={2}>
        Loading dashboard...
      </Typography>
    </Box>
  );
};

export default Loading;
