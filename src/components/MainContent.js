// MainContent.js — container for routed content with full scroll support

import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100%",
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "background.default",
        px: 2,
        py: 3,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default MainContent;
