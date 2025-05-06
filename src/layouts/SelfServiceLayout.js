import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";

const SelfServiceLayout = () => {
  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default SelfServiceLayout;
