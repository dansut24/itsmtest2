// MainContent.js (Fixed for full-width layout)

import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Box
  sx={{
    width: '100%',
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    backgroundColor: 'background.default',
    pt: { xs: '92px', sm: '92px' }, // Responsive if needed
  }}
>
  <Outlet />
</Box>
  );
};

export default MainContent;
