// MainContent.js (Fixed for full-width layout)

import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        flexGrow: 1,
        display: 'flex',
        transition: "transform 0.3s ease",
        backgroundColor: 'background.default',
      }}
    >
      <Outlet />
    </Box>
  );
};

export default MainContent;
